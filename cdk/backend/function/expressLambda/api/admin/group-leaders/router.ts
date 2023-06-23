import express from 'express'
import {
  addUserToOrganization,
  listUsersInOrganization,
  removeUserFromOrganization,
} from '../../cognito/cognitoActions'
import { getOrganizations } from '../../utils'

const router = express.Router()

// List all group leaders
router.get('/', async (req, res, next) => {
  try {
    const organization = getOrganizations(req)
    const response = await listUsersInOrganization(
      organization[0] + '0groupLeader'
    )
    res.status(200).json(response)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Promote user to group leader
router.post('/add', async (req, res, next) => {
  try {
    const organization = getOrganizations(req)
    if (typeof req.query.username !== 'string') {
      throw new Error('username must be a string')
    }
    const response = await addUserToOrganization({
      username: req.query.username,
      groupname: organization[0] + '0groupLeader',
    })
    res.status(200).json(response)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Demote user from group leader
router.post('/remove', async (req, res, next) => {
  try {
    const organization = getOrganizations(req)
    if (typeof req.query.username !== 'string') {
      throw new Error('username must be a string')
    }
    const response = await removeUserFromOrganization({
      username: req.query.username,
      groupname: organization[0] + '0groupLeader',
    })
    res.status(200).json(response)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export { router as adminGroupLeadersRouter }
