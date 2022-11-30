import { SqlParameter } from '@aws-sdk/client-rds-data'
import express from 'express'
import { sqlQuery } from '../../app'

const router = express.Router()

router.get('/list', async (req, res, next) => {
  try {
    const query = 'SELECT * FROM organization'
    const response = await sqlQuery(query)

    res.status(200).json(response)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

interface addOrganizationParams {
  id: string
  orgname: string
  identifierAttribute: string
}

router.post<unknown, unknown, addOrganizationParams>(
  '/add',
  async (req, res, next) => {
    const { id, orgname, identifierAttribute } = req.body
    try {
      const query =
        'INSERT INTO organization VALUES(:id, :orgname, :identifierAttribute);'

      const parameters: SqlParameter[] = [
        {
          name: 'id',
          value: {
            stringValue: id,
          },
        },
        {
          name: 'orgname',
          value: {
            stringValue: orgname,
          },
        },
        {
          name: 'identifierAttribute',
          value: {
            stringValue: identifierAttribute,
          },
        },
        {
          name: 'createdAt',
          value: {
            stringValue: new Date().toISOString(),
          },
        },
      ]

      const { records } = await sqlQuery(query, parameters)

      const response = { data: records }
      res.status(200).json(response)
    } catch (err) {
      next(err)
      console.error(err)
    }
  }
)

router.get('/remove')

export { router as organizationRouter }
