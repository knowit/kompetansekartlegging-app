import express from 'express'
import { IUsername } from '../../../utils/types'
import { getOrganization } from '../../../utils/utils'
import {
  addUserToOrganization,
  listUsersInOrganization,
  removeUserFromOrganization,
} from '../../queries/cognitoActions'

const router = express.Router()

// List all group leaders
router.get('/', async (req, res, next) => {
  try {
    const organization = getOrganization(req)
    const response = await listUsersInOrganization(
      organization + '0groupLeader'
    )
    res.status(200).json(response)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Promote user to group leader
router.post<unknown, unknown, unknown, IUsername>(
  '/add',
  async (req, res, next) => {
    try {
      const organization = getOrganization<unknown, IUsername>(req)
      const response = await addUserToOrganization({
        username: req.query.username,
        groupname: organization + '0groupLeader',
      })
      res.status(200).json(response)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Demote user from group leader
router.post<unknown, unknown, unknown, IUsername>(
  '/remove',
  async (req, res, next) => {
    try {
      const organization = getOrganization<unknown, IUsername>(req)
      const response = await removeUserFromOrganization({
        username: req.query.username,
        groupname: organization + '0groupLeader',
      })
      res.status(200).json(response)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as adminGroupLeaderRouter }
