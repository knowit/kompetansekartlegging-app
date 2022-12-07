import { SqlParameter, TypeHint } from "@aws-sdk/client-rds-data"
import express from "express"
import { sqlQuery } from "../../app"
import Group from "./GroupQueries"

const router = express.Router()

// List all groups with groupLeaderUsername
router.get("/list", async (req, res, next) => {
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
  "/:groupId/users",
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

interface AddReqParams {
  groupId: string
}

interface AddBodyParams {
  userId: string
  orgId: string
}

// Add user to group (essentialy creates/updates a user with groupid)
router.post<unknown, unknown, AddBodyParams, AddReqParams>(
  "/:groupId/user/add",
  async (req, res, next) => {
    try {
      const { groupId } = req.query
      const { userId, orgId } = req.body
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
  "/user/:userId/delete",
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

router.post<unknown, unknown, CreateGroupBodyParams>(
  "/create",
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

export { router as groupRouter }
