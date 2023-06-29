import express from 'express'
import { Roles, requireRoles } from '../../middlewares/roles'
import {
  ICognitoBody,
  IListQuery,
  IUsername,
  ListGroupsForUserQuery,
  ListUsersInGroupQuery,
} from '../../utils/types'
import { getRoles } from '../../utils/utils'
import { CognitoActions } from '../queries'

const router = express.Router()

router.use((req, res, next) => {
  const roles = getRoles(req)
  if (req.path == '/list-users-in-organization') {
    if (roles.includes(Roles.GROUP_LEADER) || roles.includes(Roles.ADMIN)) {
      return requireRoles([Roles.GROUP_LEADER, Roles.ADMIN])(req, res, next)
    }
  } else if (req.path == '/list-users' || req.path == '/list-organizations') {
    if (roles.includes(Roles.SUPER_ADMIN)) {
      return requireRoles([Roles.SUPER_ADMIN])(req, res, next)
    }
  }
  return requireRoles([Roles.ADMIN])(req, res, next)
})

router.post<unknown, unknown, ICognitoBody, unknown>(
  '/add-user-to-group',
  async (req, res, next) => {
    try {
      const response = await CognitoActions.addUserToOrganization(req.body)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

router.post<unknown, unknown, ICognitoBody, unknown>(
  '/remove-user-from-group',
  async (req, res, next) => {
    try {
      const response = await CognitoActions.removeUserFromOrganization(req.body)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

router.get<unknown, unknown, unknown, IUsername>(
  '/get-user',
  async (req, res, next) => {
    try {
      const response = await CognitoActions.getUser(req.query.username)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

// List all users in the cognito user pool
router.get<unknown, unknown, unknown, IListQuery>(
  '/list-users',
  async (req, res, next) => {
    try {
      const response = await CognitoActions.listUsers(
        req.query.limit || 25,
        req.query.token
      )
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

// List all organizations in the cognito user pool
router.get<unknown, unknown, unknown, IListQuery>(
  '/list-organizations',
  async (req, res, next) => {
    try {
      const response = await CognitoActions.listOrganizations(
        req.query.limit || 25,
        req.query.token
      )
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

// List all organizations for a user in the cognito user pool
router.get<unknown, unknown, unknown, ListGroupsForUserQuery>(
  '/list-organizations-for-user',
  async (req, res, next) => {
    try {
      const response = await CognitoActions.listOrganizationsForUser(
        req.query.username,
        req.query.limit || 25,
        req.query.token
      )
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

// List all users in an organization in the cognito user pool
router.get<unknown, unknown, unknown, ListUsersInGroupQuery>(
  '/list-users-in-organization',
  async (req, res, next) => {
    try {
      const response = await CognitoActions.listUsersInOrganization(
        req.query.groupname,
        req.query.limit || 25,
        req.query.token
      )
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

export default router