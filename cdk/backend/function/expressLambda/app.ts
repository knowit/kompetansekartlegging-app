import express from "express"
import {
  ExecuteStatementCommand,
  RDSDataClient,
} from "@aws-sdk/client-rds-data"

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

app.get("/", async (req, res) => {
  try {
    const sqlString = "SELECT * FROM question"
    const cmd = new ExecuteStatementCommand({
      sql: sqlString,
      resourceArn: process.env.DATABASE_ARN,
      secretArn: process.env.SECRET_ARN,
      database: process.env.DATABASE_NAME,
    })

    const dbResponse = await rds.send(cmd)

    const response = { data: dbResponse }
    res.status(200).json(response)
  } catch (err) {
    console.error(err)
  }
})

app.get<unknown, unknown, unknown, { debugName: string }>(
  "/debug",
  (req, res) => {
    return res.json({ name: req.query.debugName, message: "Buggin'" })
  }
)

module.exports = app
