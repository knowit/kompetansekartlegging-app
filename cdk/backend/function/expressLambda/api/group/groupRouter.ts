import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import express from 'express'
import { sqlQuery } from '../../app'
import Group from './groupQueries'

const router = express.Router()

// List all groups with groupLeaderUsername
router.get('/', async (req, res, next) => {
  try {
    const listGroupsResponse = await Group.listGroups()

    res.status(200).json(listGroupsResponse)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

interface GetReqParams {
  groupId: string
}

// Get all users in a group
router.get<unknown, unknown, unknown, GetReqParams>(
  '/:groupId/users',
  async (req, res, next) => {
    try {
      const { groupId } = req.query
      const listUserResponse = await Group.listUsersInGroup(groupId)

      res.status(200).json(listUserResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface UpdateGroupReqParams {
  groupId: string
}

interface UpdateGroupBodyParams {
  groupLeaderUsername: string
  orgId: string
}

// Add user to group (essentialy creates/updates a user with groupid)
router.post<unknown, unknown, UpdateGroupBodyParams, UpdateGroupReqParams>(
  '/:groupId/user',
  async (req, res, next) => {
    try {
      const { groupId } = req.query
      const { groupLeaderUsername: userId, orgId } = req.body
      const upsertResponse = await Group.upsert(userId, groupId, orgId)

      res.status(200).json(upsertResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface DelReqParams {
  userId: string
}

// Delete user from group (essentially deletes user)
router.delete<unknown, unknown, unknown, DelReqParams>(
  '/user/:userId',
  async (req, res, next) => {
    try {
      const { userId } = req.query
      const deleteResponse = await Group.deleteUser(userId)

      res.status(200).json(deleteResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface CreateGroupBodyParams {
  groupLeaderUsername: string
  orgId: string
}
// Create a group
router.post<unknown, unknown, CreateGroupBodyParams>(
  '/',
  async (req, res, next) => {
    try {
      const { groupLeaderUsername, orgId } = req.body
      const addGroupResponse = await Group.createGroup(
        groupLeaderUsername,
        orgId
      )

      res.status(200).json(addGroupResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface DelGroupReqParams {
  groupId: string
}
// Delete a group
router.delete<unknown, unknown, unknown, DelGroupReqParams>(
  '/:groupId',
  async (req, res, next) => {
    try {
      const { groupId } = req.query
      const deleteResponse = await Group.deleteGroup(groupId)

      res.status(200).json(deleteResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface UpdateGroupReqParams {
  groupId: string
}

interface UpdateGroupBodyParams {
  groupLeaderUsername: string
}

// Update group leader
router.patch<unknown, unknown, UpdateGroupBodyParams, UpdateGroupReqParams>(
  '/:groupId',
  async (req, res, next) => {
    try {
      const { groupId } = req.query
      const { groupLeaderUsername } = req.body
      const updateResponse = await Group.updateGroupLeader(
        groupId,
        groupLeaderUsername
      )

      res.status(200).json(updateResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as groupRouter }
