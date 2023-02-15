import { NextFunction, Request, Response } from 'express'

export const requireRole = (role: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.query
    if (user && user.roles.includes(role)) {
      next()
    } else {
      res.status(403).send('Access Denied')
    }
  }
}
