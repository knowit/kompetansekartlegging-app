import { SqlParameter, TypeHint } from "@aws-sdk/client-rds-data"
import express from "express"
import { sqlQuery } from "../../app"

const router = express.Router()

// List all groups with groupLeaderUsername
router.get("/list", async (req, res, next) => {
  try {
    const query = 'SELECT id, groupLeaderUsername FROM "group"'
    const records = await sqlQuery(query)

    const response = { data: records }

    res.status(200).json(response)
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
      const query = 'SELECT id, groupid FROM "user" WHERE groupid = :groupId'

      const params: SqlParameter[] = [
        {
          name: "groupId",
          value: {
            stringValue: groupId,
          },
          typeHint: TypeHint.UUID,
        },
      ]

      const records = await sqlQuery(query, params)
      const response = { data: records }

      res.status(200).json(response)
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

      const UPSERT_QUERY = `INSERT INTO "user" (id, groupid, organizationid) 
        VALUES (:id, :groupid, :organizationid) 
        ON CONFLICT (id) 
        DO UPDATE SET groupid = :groupid, organizationid = :organizationid 
        WHERE excluded.id=:id 
        RETURNING *`

      const response = await sqlQuery(UPSERT_QUERY, [
        {
          name: "id",
          value: {
            stringValue: userId,
          },
        },
        {
          name: "groupid",
          value: {
            stringValue: groupId,
          },
          typeHint: TypeHint.UUID,
        },
        {
          name: "organizationid",
          value: {
            stringValue: orgId,
          },
        },
      ])

      res.status(200).json({
        message: `🚀 ~ > User '${userId}' is now in group '${groupId}'.`,
        response,
      })
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

      const response = await sqlQuery(
        'DELETE FROM "user" WHERE id = :id RETURNING *',
        [
          {
            name: "id",
            value: {
              stringValue: userId,
            },
          },
        ]
      )

      res
        .status(200)
        .json({ message: `🚀 ~ > User ${userId} deleted.`, response })
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as groupRouter }
