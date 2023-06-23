import { NextFunction, Request, Response } from 'express'
import { getRoles } from '../api/utils'

export enum Roles {
  SUPER_ADMIN = 'superadmin',
  ADMIN = 'admin',
  GROUP_LEADER = 'groupleader',
}

export const requireRoles = (roles: Roles[], requireAll: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('🔒 Protected. Required roles: ', roles.join(', '))

    const userRoles = getRoles(req)
    console.log(
      '🔑 User roles: ',
      userRoles.length >= 1 ? userRoles.join(', ') : 'No roles.'
    )

    if (userRoles) {
      const hasRoles = requireAll
        ? roles.every(r => userRoles.includes(r))
        : roles.some(r => userRoles.includes(r))

      if (hasRoles) {
        next()
        return
      }
    }

    console.log('🚫 Access denied.')
    res.status(403).send(`🚫 Access Denied: ${roles} required.`)
  }
}
