import express from 'express'
import Group from './queries'

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
  '/users',
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

interface AddUserBodyParams {
  id: string
  orgid: string
}

// Add user to group (essentialy creates/updates a user with groupid)
router.post<unknown, unknown, AddUserBodyParams, UpdateGroupReqParams>(
  '/user',
  async (req, res, next) => {
    try {
      const { groupId } = req.query
      const { id, orgid } = req.body
      const upsertResponse = await Group.upsert(id, groupId, orgid)

      res.status(200).json(upsertResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface DelReqParams {
  id: string
}

// Delete user from group (essentially deletes user)
router.delete<unknown, unknown, DelReqParams>(
  '/user',
  async (req, res, next) => {
    try {
      const { id } = req.body
      const deleteResponse = await Group.deleteUser(id)

      res.status(200).json(deleteResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface CreateGroupBodyParams {
  groupleaderusername: string
  orgid: string
}
// Create a group
router.post<unknown, unknown, CreateGroupBodyParams>(
  '',
  async (req, res, next) => {
    try {
      const { groupleaderusername, orgid } = req.body
      const addGroupResponse = await Group.createGroup(
        groupleaderusername,
        orgid
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
router.delete<unknown, unknown, DelGroupReqParams>(
  '',
  async (req, res, next) => {
    try {
      const { groupId } = req.body
      const deleteResponse = await Group.deleteGroup(groupId)

      res.status(200).json(deleteResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface UpdateGroupReqParams {
  groupid: string
}

interface UpdateGroupBodyParams {
  groupleaderusername: string
}

// Update group leader
router.patch<unknown, unknown, UpdateGroupBodyParams, UpdateGroupReqParams>(
  '',
  async (req, res, next) => {
    try {
      const { groupId } = req.query
      const { groupleaderusername } = req.body
      const updateResponse = await Group.updateGroupLeader(
        groupId,
        groupleaderusername
      )

      res.status(200).json(updateResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as groupRouter }
