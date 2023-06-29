import express from 'express'
import { Roles, requireRoles } from '../../middlewares/roles'
import {
  addUserToOrganization,
  listUsersInOrganization,
  removeUserFromOrganization,
} from '../queries/cognitoActions'

import Admin from '../queries/admin'

import { IUsername } from '../../utils/types'
import { getOrganization } from '../../utils/utils'
import { adminCatalogsRouter } from './admin/catalog'
import { adminCategoriesRouter } from './admin/categories'
import { adminGroupLeaderRouter } from './admin/group-leader'
import { adminGroupsRouter } from './admin/groups'
import { adminQuestionsRouter } from './admin/questions'

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
router.post<unknown, unknown, unknown, IUsername>(
  '/add',
  async (req, res, next) => {
    try {
      const organization = getOrganization<any, IUsername>(req)
      const response = await addUserToOrganization({
        username: req.query.username,
        groupname: organization + '0admin',
      })
      res.status(200).json(response)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Demote user from admin
router.post<unknown, unknown, unknown, IUsername>(
  '/remove',
  async (req, res, next) => {
    try {
      const organization = getOrganization<unknown, IUsername>(req)
      const response = await removeUserFromOrganization({
        username: req.query.username,
        groupname: organization + '0admin',
      })
      res.status(200).json(response)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

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
