import express from 'express'
import Group from '../../groups/queries'
import {
  DeleteGroupInput,
  GetGroupInput,
  GroupInput,
  UpdateGroupLeaderInput,
} from '../../groups/types'

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

export { router as adminGroupsRouter }
