import express from 'express'
import { Roles, requireRoles } from '../../middlewares/roles'
import { listOrganizations, listUsers } from '../cognito/cognitoActions'

const router = express.Router()

router.use(requireRoles([Roles.SUPER_ADMIN]))

// Get all users across organizations
router.get('/users', async (req, res, next) => {
  try {
    const users = await listUsers()
    res.status(200).json(users)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// List all organizations
router.get('/organizations', async (req, res, next) => {
  try {
    const organizations = await listOrganizations()
    res.status(200).json(organizations)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

/*
  1. Opprette tre grupper i Cognito org, org0groupLeader og org0admin
  2. Opprette database entry for org med attributter
  3. Legge admin hvis valgt inn i org0admin i Cognito
*/

//Create organization
router.post('/organizations', async (req, res, next) => {
  try {
  } catch {}
})

/*
  1. Slette tre grupper i Cognito org, org0groupLeader og org0admin
  2. Slette database entry for org med attributter
*/

//Delete organization
router.delete('/organizations', async (req, res, next) => {})

export { router as superAdminRouter }
