import express from 'express'
import { Roles, requireRoles } from '../../middlewares/roles'
import { Admin, CognitoActions } from '../queries'

import { IUsername } from '../../utils/types'
import { getOrganization } from '../../utils/utils'
import {
  adminCatalogsRouter,
  adminCategoriesRouter,
  adminGroupLeaderRouter,
  adminGroupsRouter,
  adminQuestionsRouter,
} from './adminRouters'

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
    const response = await CognitoActions.listUsersInOrganization(
      organization + '0admin'
    )
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
      const response = await CognitoActions.addUserToOrganization({
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
      const response = await CognitoActions.removeUserFromOrganization({
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

export default router