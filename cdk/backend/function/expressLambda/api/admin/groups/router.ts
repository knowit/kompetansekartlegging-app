import express from 'express'
import {
  addGroupIdToUserAttributes,
  removeGroupIdFromUserAttributes,
} from '../../cognito/cognitoActions'
import Group from '../../groups/queries'
import {
  DeleteGroupInput,
  GetGroupInput,
  GroupInput,
  UpdateGroupLeaderInput,
} from '../../groups/types'
import { AddUserToGroupBody, IUsername } from '../types'

const router = express.Router()

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

router.post<unknown, unknown, unknown, IUsername>(
  '/remove-user',
  async (req, res, next) => {
    try {
      const { username } = req.query
      const response = await removeGroupIdFromUserAttributes(username)
      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

router.post<unknown, unknown, AddUserToGroupBody, IUsername>(
  '/add-user',
  async (req, res, next) => {
    try {
      const { username } = req.query
      const { group_id } = req.body
      const response = await addGroupIdToUserAttributes({
        username,
        groupId: group_id,
      })
      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

export { router as adminGroupsRouter }
