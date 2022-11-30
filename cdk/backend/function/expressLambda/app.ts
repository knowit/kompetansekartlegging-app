import express from "express"
import {
  ExecuteStatementCommand,
  ExecuteStatementRequest,
  RDSDataClient,
  SqlParameter,
} from "@aws-sdk/client-rds-data"
import { apiRouter } from "./api/router"

const rds = new RDSDataClient({ region: "eu-central-1" })

const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

// Add all API routerse
app.use("/api", apiRouter)

const cmdConstants = {
  resourceArn: process.env.DATABASE_ARN,
  secretArn: process.env.SECRET_ARN,
  database: process.env.DATABASE_NAME,
}

export const sqlQuery = async (query: string, parameters?: SqlParameter[]) => {
  const cmd = new ExecuteStatementCommand({
    sql: query,
    parameters,
    ...cmdConstants,
  })

  return await rds.send(cmd)
}

export default app
