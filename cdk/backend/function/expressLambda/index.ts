import app from "./app"

const awsServerlessExpress = require("aws-serverless-express")

const server = awsServerlessExpress.createServer(app)

exports.handler = (event: any, context: any) => {
  console.log(`EVENT: ${JSON.stringify(event)}`)
  awsServerlessExpress.proxy(server, event, context)
}
