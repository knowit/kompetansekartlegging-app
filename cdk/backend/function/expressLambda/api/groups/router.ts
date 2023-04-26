import express from 'express'
import Group from './queries'
import {
  AddUserInput,
  DeleteGroupInput,
  DeleteUserInput,
  GetGroupInput,
  GetUsersInput,
  GroupInput,
  UpdateGroupLeaderInput,
} from './types'

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

// Get all users in a group
router.get<unknown, unknown, unknown, GetUsersInput>(
  '/users',
  async (req, res, next) => {
    try {
      const listUserResponse = await Group.listUsersInGroup(req.query)

      res.status(200).json(listUserResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Add user to group (essentialy creates/updates a user with groupid)
router.post<unknown, unknown, AddUserInput, GetGroupInput>(
  '/user',
  async (req, res, next) => {
    try {
      const { id: group_id } = req.query
      const { username, organization_id } = req.body
      const upsertResponse = await Group.upsert({
        group_id,
        username,
        organization_id,
      })

      res.status(200).json(upsertResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Delete user from group (essentially deletes user)
router.delete<unknown, unknown, DeleteUserInput>(
  '/user',
  async (req, res, next) => {
    try {
      const deleteResponse = await Group.deleteUserFromGroup(req.body)

      res.status(200).json(deleteResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Create a group
router.post<unknown, unknown, GroupInput>('/', async (req, res, next) => {
  try {
    const addGroupResponse = await Group.createGroup(req.body)

    res.status(200).json(addGroupResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Delete a group
router.delete<unknown, unknown, DeleteGroupInput>(
  '/',
  async (req, res, next) => {
    try {
      const deleteResponse = await Group.deleteGroup(req.body)

      res.status(200).json(deleteResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Update group leader
router.patch<unknown, unknown, UpdateGroupLeaderInput, GetGroupInput>(
  '/',
  async (req, res, next) => {
    try {
      const updateResponse = await Group.updateGroupLeader(req.query, req.body)

      res.status(200).json(updateResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as groupRouter }
