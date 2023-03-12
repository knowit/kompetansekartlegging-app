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
interface SqlQueryInput {
  query: string
  parameters?: SqlParameter[]
  message: string
}
export const sqlQuery = async ({
  query,
  parameters,
  message,
}: SqlQueryInput) => {
  const cmd = new ExecuteStatementCommand({
    sql: query,
    parameters,
    ...cmdConstants,
    formatRecordsAs: RecordsFormatType.JSON,
  })
  const response = await rds.send(cmd)

  const status =
    response.$metadata.httpStatusCode &&
    response.$metadata.httpStatusCode >= 200 &&
    response.$metadata.httpStatusCode < 300
      ? 'ok'
      : 'unknown'

  console.log('🚀 ~ response', response)
  if (response.formattedRecords) {
    const records = JSON.parse(response.formattedRecords)
    if (records.length === 0) {
      return {
        status,
        message: '🧨 ~ No records returned from the query.',
        data: null,
      }
    }
    return {
      status,
      message,
      data: records.length === 1 ? records[0] : records,
    }
  } else {
    throw new Error(`Something went wrong in sqlQuery(...)`)
  }
}
export default app
