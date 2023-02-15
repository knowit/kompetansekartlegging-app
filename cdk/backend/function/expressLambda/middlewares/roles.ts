import { NextFunction, Request, Response } from 'express'

export enum Role {
  ADMIN = 'admin',
  GROUP_LEADER = 'groupleader',
}

export const getRoles = (req: Request) =>
  req.apiGateway.event.requestContext.authorizer?.claims['cognito:groups']
    .split(',')
    .map((r: string) => {
      const role = r.split('0')
      if (role.length > 1) {
        return role[1].toLocaleLowerCase()
      }
    })

export const requireRole = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = getRoles(req)

    if (userRoles.includes(role)) {
      next()
    } else {
      res.status(403).send(`Access Denied: ${role} required`)
    }
  }
}
