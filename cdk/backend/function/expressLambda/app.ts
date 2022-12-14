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

export const sqlQuery = async (query: string, parameters?: SqlParameter[]) => {
  console.log('🚀 ~ file: app.ts:41 ~ sqlQuery ~ parameters', parameters)
  console.log('🚀 ~ file: app.ts:41 ~ sqlQuery ~ query', query)
  const cmd = new ExecuteStatementCommand({
    sql: query,
    parameters,
    ...cmdConstants,
    formatRecordsAs: RecordsFormatType.JSON,
  })
  console.log('🚀 ~ file: app.ts:49 ~ sqlQuery ~ cmd', cmd)

  const response = await rds.send(cmd)
  console.log('🚀 ~ file: app.ts:52 ~ sqlQuery ~ response', response)

  if (response.formattedRecords) {
    return JSON.parse(response.formattedRecords)
  } else {
    throw new Error(`Records not found for query ${query}`)
  }
}

export default app
