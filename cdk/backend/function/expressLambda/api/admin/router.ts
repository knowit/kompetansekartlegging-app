import { AdminGetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider'
import express from 'express'
import { Roles, requireRoles } from '../../middlewares/roles'
import {
  addUserToGroup,
  getUser,
  listUsersInGroup,
  removeUserFromGroup,
} from '../cognito/cognitoActions'
import Group from '../groups/queries'
import { User } from '../groups/types'
import { GetGroupQuery, UserAnnotated } from './types'

import { getOrganizations } from '../utils'
import { adminCatalogsRouter } from './catalog/router'
import { adminCategoriesRouter } from './categories/router'
import { adminGroupLeadersRouter } from './group-leaders/router'
import { adminGroupsRouter } from './groups/router'
import { adminQuestionsRouter } from './questions/router'

const router = express.Router()

router.use(requireRoles([Roles.ADMIN]))

router.use('/catalogs', adminCatalogsRouter)
router.use('/categories', adminCategoriesRouter)
router.use('/questions', adminQuestionsRouter)
router.use('/groups', adminGroupsRouter)
router.use('/group-leaders', adminGroupLeadersRouter)

router.get<unknown, unknown, unknown, GetGroupQuery>(
  '/get-group',
  async (req, res, next) => {
    try {
      const members: UserAnnotated[] = []
      const { id } = req.query
      const group = await Group.getGroup({ id })
      const groupLeader = await getUser(group.data!.group_leader_username)
      const groupMembers = await Group.listUsersInGroup({ group_id: id })
      console.log(groupMembers.data)
      await Promise.all(
        groupMembers.data!.map(async (user: User) => {
          return getUser(user.username).then((member: AdminGetUserResponse) => {
            const { Username, ...newMember } = { ...user, ...member }
            members.push(newMember)
          })
        })
      )
        .then(() => {
          const result = {
            status: 'ok',
            message: `🚀 ~ > Admin info on group with id ${id}`,
            data: {
              leader: groupLeader,
              members: members,
            },
          }
          return result
        })
        .then(result => res.status(200).json(result))
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// List all admins
router.get('/', async (req, res, next) => {
  try {
    const organization = getOrganizations(req)
    const response = await listUsersInGroup(organization[0] + '0admin')
    res.status(200).json(response)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Promote user to admin
router.post('/add', async (req, res, next) => {
  try {
    const organization = getOrganizations(req)
    if (typeof req.query.username !== 'string') {
      throw new Error('username must be a string')
    }
    const response = await addUserToGroup({
      username: req.query.username,
      groupname: organization[0] + '0admin',
    })
    res.status(200).json(response)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Demote user from admin
router.post('/remove', async (req, res, next) => {
  try {
    const organization = getOrganizations(req)
    if (typeof req.query.username !== 'string') {
      throw new Error('username must be a string')
    }
    const response = await removeUserFromGroup({
      username: req.query.username,
      groupname: organization[0] + '0admin',
    })
    res.status(200).json(response)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

/*
1. Anonymiser bruker (slett cognito bruker og sett question answer id til en unik, men konsekvent streng)
*/

export { router as adminRouter }
