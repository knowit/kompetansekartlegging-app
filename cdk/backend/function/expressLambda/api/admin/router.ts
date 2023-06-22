import { AdminGetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider'
import express from 'express'
import { Roles, requireRoles } from '../../middlewares/roles'
import {
  addGroupIdToUserAttributes,
  getUser,
  removeGroupIdFromUserAttributes,
} from '../cognito/cognitoActions'
import Group from '../groups/queries'
import { User } from '../groups/types'
import {
  AddUserToGroupBody,
  GetGroupQuery,
  IUsername,
  UserAnnotated,
} from './types'

import { adminCatalogsRouter } from './catalog/router'
import { adminCategoriesRouter } from './categories/router'

const router = express.Router()

router.use(requireRoles([Roles.ADMIN]))

router.use('/catalogs', adminCatalogsRouter)
router.use('/categories', adminCategoriesRouter)

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

router.post<unknown, unknown, unknown, IUsername>(
  '/group/remove-user',
  async (req, res, next) => {
    try {
      const { username } = req.query
      const response = await removeGroupIdFromUserAttributes(username)
      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

router.post<unknown, unknown, AddUserToGroupBody, IUsername>(
  '/group/add-user',
  async (req, res, next) => {
    try {
      const { username } = req.query
      const { group_id } = req.body
      const response = await addGroupIdToUserAttributes({
        username,
        groupId: group_id,
      })
      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

export { router as adminRouter }
