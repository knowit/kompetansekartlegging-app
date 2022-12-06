import { SqlParameter } from '@aws-sdk/client-rds-data'
import express from 'express'
import { sqlQuery } from '../../app'

const router = express.Router()

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

interface GetUsersInGroupParams {
  groupId: string
}

router.get<unknown, unknown, unknown, GetUsersInGroupParams>(
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
          typeHint: 'UUID',
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
export { router as groupRouter }
