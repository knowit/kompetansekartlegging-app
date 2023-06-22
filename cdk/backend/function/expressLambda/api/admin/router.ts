import express from 'express'
import { Roles, requireRoles } from '../../middlewares/roles'
import {
  addUserToGroup,
  listUsersInGroup,
  removeUserFromGroup,
} from '../cognito/cognitoActions'

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
