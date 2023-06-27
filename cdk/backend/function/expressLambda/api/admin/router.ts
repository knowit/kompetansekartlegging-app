import express from 'express'
import { Roles, requireRoles } from '../../middlewares/roles'
import {
  addUserToOrganization,
  listUsersInOrganization,
  removeUserFromOrganization,
} from '../cognito/cognitoActions'

import Admin from './queries'

import { IUsername } from '../../utils/types'
import { getOrganization } from '../utils'
import { adminCatalogsRouter } from './catalog/router'
import { adminCategoriesRouter } from './categories/router'
import { adminGroupLeaderRouter } from './group-leader/router'
import { adminGroupsRouter } from './groups/router'
import { adminQuestionsRouter } from './questions/router'

const router = express.Router()

router.use(requireRoles([Roles.ADMIN]))

router.use('/catalogs', adminCatalogsRouter)
router.use('/categories', adminCategoriesRouter)
router.use('/questions', adminQuestionsRouter)
router.use('/groups', adminGroupsRouter)
router.use('/group-leader', adminGroupLeaderRouter)

// List all admins in requesters organization
router.get('/', async (req, res, next) => {
  try {
    const organization = getOrganization(req)
    const response = await listUsersInOrganization(organization + '0admin')
    res.status(200).json(response)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Promote user to admin
router.post('/add', async (req, res, next) => {
  try {
    const organization = getOrganization(req)
    if (typeof req.query.username !== 'string') {
      throw new Error('username must be a string')
    }
    const response = await addUserToOrganization({
      username: req.query.username,
      groupname: organization + '0admin',
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
    const organization = getOrganization(req)
    if (typeof req.query.username !== 'string') {
      throw new Error('username must be a string')
    }
    const response = await removeUserFromOrganization({
      username: req.query.username,
      groupname: organization + '0admin',
    })
    res.status(200).json(response)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Anonymize user
router.patch<unknown, unknown, unknown, IUsername>(
  '/anonymize',
  async (req, res, next) => {
    try {
      const anonymizeResponse = await Admin.unlinkUserFromQuestionAnswer(
        req.query
      )

      res.status(200).json(anonymizeResponse)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

export { router as adminRouter }
