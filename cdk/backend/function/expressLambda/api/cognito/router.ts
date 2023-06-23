import express from 'express'
import { Roles, requireRoles } from '../../middlewares/roles'
import { getRoles } from '../utils'
import {
  addUserToOrganization,
  getUser,
  listGroups,
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
  if (req.path == '/listUsersInOrganization') {
    const roles = getRoles(req)
    if (roles.includes(Roles.GROUP_LEADER) || roles.includes(Roles.ADMIN)) {
      return next()
    }
  }
  return requireRoles([Roles.ADMIN])(req, res, next)
})

router.post<unknown, unknown, Body, unknown>(
  '/addUserToOrganization',
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
  '/removeUserFromOrganizatino',
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
  '/getUser',
  async (req, res, next) => {
    try {
      const response = await getUser(req.query.username)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

router.get<unknown, unknown, unknown, ListQuery>(
  '/listUsers',
  async (req, res, next) => {
    try {
      const response = await listUsers(req.query.limit || 25, req.query.token)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

router.get<unknown, unknown, unknown, ListQuery>(
  '/listOrganizations',
  async (req, res, next) => {
    try {
      const response = await listGroups(req.query.limit || 25, req.query.token)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

router.get<unknown, unknown, unknown, ListGroupsForUserQuery>(
  '/listOrganizationsForUser',
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

router.get<unknown, unknown, unknown, ListUsersInGroupQuery>(
  '/listUsersInOrganization',
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
