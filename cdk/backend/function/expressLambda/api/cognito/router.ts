import express from 'express'
import {
  addUserToGroup,
  confirmUserSignUp,
  disableUser,
  enableUser,
  getUser,
  listGroups,
  listGroupsForUser,
  listUsers,
  listUsersInGroup,
  removeUserFromGroup,
  signUserOut,
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
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

// Only perform tasks if the user is in a specific group
const allowedGroup = process.env.GROUP
const allowedListUsersGroup = process.env.GROUP_LIST_USERS

const checkGroup = function(req: any, res: any, next: any) {
  if (req.path == '/signUserOut') {
    return next()
  }

  if (typeof allowedGroup === 'undefined' || allowedGroup === 'NONE') {
    return next()
  }

  // Fail if group enforcement is being used
  if (req.apiGateway.event.requestContext.authorizer.claims['cognito:groups']) {
    const groups = req.apiGateway.event.requestContext.authorizer.claims[
      'cognito:groups'
    ].split(',')
    const newRoles: any[] = []
    groups.forEach((group: any) => {
      const splitGroup = group.split('0')
      if (splitGroup.length > 1) {
        newRoles.push(splitGroup[1])
      }
    })
    groups.push(...newRoles)
    // allow groupLeader group to list all users in the cognito user pool
    if (
      (req.path == '/listUsers' || req.path == '/listUsersInGroup') &&
      groups.includes(allowedListUsersGroup)
    ) {
    } else if (!(allowedGroup && groups.indexOf(allowedGroup) > -1)) {
      const err = new Error(
        `User does not have permissions to perform administrative tasks`
      )
      next(err)
    }
  } else {
    const err = new Error(
      `User does not have permissions to perform administrative tasks`
    )
    res.status(403).json(err)
    next(err)
  }
  next()
}

router.all('*', checkGroup)

router.post<unknown, unknown, Body, unknown>(
  '/addUserToGroup',
  async (req, res, next) => {
    try {
      const response = await addUserToGroup(req.body)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

router.post<unknown, unknown, Body, unknown>(
  '/removeUserFromGroup',
  async (req, res, next) => {
    try {
      const response = await removeUserFromGroup(req.body)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

router.post<unknown, unknown, UserBody, unknown>(
  '/confirmUserSignUp',
  async (req, res, next) => {
    try {
      const response = await confirmUserSignUp(req.body.username)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

router.post<unknown, unknown, UserBody, unknown>(
  '/disableUser',
  async (req, res, next) => {
    try {
      const response = await disableUser(req.body.username)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

router.post<unknown, unknown, UserBody, unknown>(
  '/enableUser',
  async (req, res, next) => {
    try {
      const response = await enableUser(req.body.username)
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
  '/listGroups',
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
  '/listGroupsForUser',
  async (req, res, next) => {
    try {
      const response = await listGroupsForUser(
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
  '/listUsersInGroup',
  async (req, res, next) => {
    try {
      const response = await listUsersInGroup(
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

router.post<unknown, unknown, UserBody, unknown>(
  '/signUserOut',
  async (req, res, next) => {
    /**
     * To prevent rogue actions of users with escalated privilege signing
     * other users out, we ensure it's the same user making the call
     * Note that this only impacts actions the user can do in User Pools
     * such as updating an attribute, not services consuming the JWT
     */
    if (
      req.body.username !=
        req.apiGateway.event.requestContext.authorizer.claims.username &&
      req.body.username !=
        /[^/]*$/.exec(req.apiGateway.event.requestContext.identity.userArn)![0]
    ) {
      const err = new Error('only the user can sign themselves out')
      return next(err)
    }

    try {
      const response = await signUserOut(req.body.username)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
)

export { router as cognitoRouter }
