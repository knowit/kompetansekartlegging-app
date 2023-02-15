declare namespace Express {
  export interface Request {
    apiGateway: {
      event: APIGatewayEvent
    }
  }
}
