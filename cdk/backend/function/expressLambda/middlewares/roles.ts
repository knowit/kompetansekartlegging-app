import { NextFunction, Request, Response } from 'express'
import { getRoles } from '../api/utils'

export enum Role {
  ADMIN = 'admin',
  GROUP_LEADER = 'groupleader',
}

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
