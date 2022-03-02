const serverlessExpress = require("@vendia/serverless-express");
const app = require("./app");

const serverlessExpressInstance = serverlessExpress({ app });

exports.handler = (event, context) => {
    return serverlessExpressInstance(event, context);
};