import express from "express"
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
    const response = { data: "hei, det funket" }
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
