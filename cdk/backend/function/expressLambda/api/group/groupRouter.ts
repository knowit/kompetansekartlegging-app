import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import express from 'express'
import { sqlQuery } from '../../app'

const router = express.Router()

// List all groups with groupLeaderUsername
router.get('/list', async (req, res, next) => {
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
  '/:groupId/users',
  async (req, res, next) => {
    try {
      const { groupId } = req.query
      const query = 'SELECT id, groupid FROM "user" WHERE groupid = :groupId'

      const params: SqlParameter[] = [
        {
          name: 'groupId',
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
  '/:groupId/user/add',
  async (req, res, next) => {
    try {
      const { groupId } = req.query
      const { userId, orgId } = req.body

      // Check if user exists
      const user = await sqlQuery('SELECT * FROM "user" WHERE id = :id', [
        {
          name: 'id',
          value: {
            stringValue: userId,
          },
        },
      ])

      const parameters: SqlParameter[] = [
        {
          name: 'id',
          value: {
            stringValue: userId,
          },
        },
        {
          name: 'groupid',
          value: {
            stringValue: groupId,
          },
          typeHint: TypeHint.UUID,
        },
        {
          name: 'organizationid',
          value: {
            stringValue: orgId,
          },
        },
      ]

      // If user does not exist
      if (user.length == 0) {
        console.log('🚀 ~ > ~ User does not exist, creating new.')
        const response = await sqlQuery(
          'INSERT INTO "user" (id, groupid, organizationid) VALUES (:id, :groupid, :organizationid) RETURNING *',
          parameters
        )

        return res.status(200).json({
          message: '🚀 ~ > User did not exist, - created new.',
          response,
        })
      }

      // If user exists
      console.log('🚀 ~ > ~ User does exist, updating.')
      const response = await sqlQuery(
        'UPDATE "user" SET groupid = :groupid, organizationid = :organizationid WHERE id=:id RETURNING *',
        parameters
      )

      res
        .status(200)
        .json({ message: '🚀 ~ > User does exist, updated.', response })
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
  '/user/:userId/delete',
  async (req, res, next) => {
    try {
      const { userId } = req.query

      const response = await sqlQuery(
        'DELETE FROM "user" WHERE id = :id RETURNING *',
        [
          {
            name: 'id',
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
