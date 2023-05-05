import {
  ExecuteStatementCommand,
  RDSDataClient,
  RecordsFormatType,
  SqlParameter,
} from '@aws-sdk/client-rds-data'
import express from 'express'
import { apiRouter } from './api/router'
const rds = new RDSDataClient({ region: 'eu-central-1' })
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())
// Enable CORS for all methods
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
// Add all API routerse
app.use('/api', apiRouter)
const cmdConstants = {
  resourceArn: process.env.DATABASE_ARN,
  secretArn: process.env.SECRET_ARN,
  database: process.env.DATABASE_NAME,
}

interface SqlQueryInput<T> {
  query: string
  parameters?: SqlParameter[]
  message: string
  isArray?: boolean
}

type SqlQueryResult<T> = {
  status: string
  message: string
  data: T | null
}

export const sqlQuery = async <T>({
  query,
  parameters,
  message,
  isArray = false,
}: SqlQueryInput<T>): Promise<SqlQueryResult<T>> => {
  const cmd = new ExecuteStatementCommand({
    sql: query,
    parameters,
    ...cmdConstants,
    formatRecordsAs: RecordsFormatType.JSON,
  })

  const response = await rds.send(cmd)

  return handleResponse<T>(response, message, isArray)
}

const handleResponse = <T>(
  response: any,
  message: string,
  isArray: boolean
): SqlQueryResult<T> => {
  const status =
    response.$metadata.httpStatusCode >= 200 &&
    response.$metadata.httpStatusCode < 300
      ? 'ok'
      : 'unknown'

  if (response.formattedRecords) {
    const records = isArray
      ? (JSON.parse(response.formattedRecords) as T)
      : (JSON.parse(response.formattedRecords)[0] as T)
    return { status, message, data: records || null }
  }

  throw new Error('Something went wrong in sqlQuery(...)')
}
export default app
