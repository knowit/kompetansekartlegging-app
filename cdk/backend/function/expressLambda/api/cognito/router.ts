import express from 'express'
import { Roles, requireRoles } from '../../middlewares/roles'
import { getRoles } from '../utils'
import {
  addUserToOrganization,
  getUser,
  listOrganizations,
  listOrganizationsForUser,
  listUsers,
  listUsersInOrganization,
  removeUserFromOrganization,
} from './cognitoActions'
import {
  Body,
  ListGroupsForUserQuery,
  ListQuery,
  ListUsersInGroupQuery,
  UserBody,
} from './types'

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

router.post<unknown, unknown, Body, unknown>(
  '/add-user-to-organization',
  async (req, res, next) => {
    try {
      const response = await addUserToOrganization(req.body)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

router.post<unknown, unknown, Body, unknown>(
  '/remove-user-from-organization',
  async (req, res, next) => {
    try {
      const response = await removeUserFromOrganization(req.body)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

router.get<unknown, unknown, unknown, UserBody>(
  '/get-user',
  async (req, res, next) => {
    try {
      const response = await getUser(req.query.username)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

// List all users in the cognito user pool
router.get<unknown, unknown, unknown, ListQuery>(
  '/list-users',
  async (req, res, next) => {
    try {
      const response = await listUsers(req.query.limit || 25, req.query.token)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

// List all organizations in the cognito user pool
router.get<unknown, unknown, unknown, ListQuery>(
  '/list-organizations',
  async (req, res, next) => {
    try {
      const response = await listOrganizations(
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
      const response = await listOrganizationsForUser(
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
      const response = await listUsersInOrganization(
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

export { router as cognitoRouter }
