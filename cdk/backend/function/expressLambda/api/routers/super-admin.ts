import express from 'express'
import { Roles, requireRoles } from '../../middlewares/roles'
import { CognitoActions, Organizations } from '../queries'

const router = express.Router()

router.use(requireRoles([Roles.SUPER_ADMIN]))

// Get all users across organizations
router.get('/users', async (req, res, next) => {
  try {
    const users = await CognitoActions.listUsers()
    res.status(200).json(users)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// List all super admins
router.get('/', async (req, res, next) => {
  try {
    const users = await CognitoActions.listUsersInOrganization('admin')
    res.status(200).json(users)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// List all admins across organizations
router.get('/admins', async (req, res, next) => {
  try {
    const users = await CognitoActions.listAdminsInAllOrganizations()
    res.status(200).json(users)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

interface IAddUserToAdminOrganization {
  organization_identifier_attribute: string
  username: string
}

// Promote user to admin
router.post<unknown, unknown, IAddUserToAdminOrganization>(
  '/admins/add',
  async (req, res, next) => {
    try {
      const response = await CognitoActions.addUserToOrganization({
        username: req.body.username,
        groupname: req.body.organization_identifier_attribute + '0admin',
      })
      res.status(200).json(response)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface IRemoveUserFromAdminOrganization {
  organization_identifier_attribute: string
  username: string
}

// Demote user from admin
router.post<unknown, unknown, IRemoveUserFromAdminOrganization>(
  '/admins/remove',
  async (req, res, next) => {
    try {
      const response = await CognitoActions.removeUserFromOrganization({
        username: req.body.username,
        groupname: req.body.organization_identifier_attribute + '0admin',
      })
      res.status(200).json(response)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface IAddSuperAdminBody {
  username: string
}

// Promote user to superadmin
router.post<unknown, unknown, IAddSuperAdminBody>(
  '/add',
  async (req, res, next) => {
    try {
      const response = await CognitoActions.addUserToOrganization({
        username: req.body.username,
        groupname: 'admin',
      })
      res.status(200).json(response)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface IRemoveSuperAdminBody {
  username: string
}

// Demote user from superadmin
router.post<unknown, unknown, IRemoveSuperAdminBody>(
  '/remove',
  async (req, res, next) => {
    try {
      const response = await CognitoActions.removeUserFromOrganization({
        username: req.body.username,
        groupname: 'admin',
      })
      res.status(200).json(response)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// List all organizations
router.get('/organizations', async (req, res, next) => {
  try {
    const organizations = await CognitoActions.listOrganizations()
    res.status(200).json(organizations)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

interface ICreateOrganizationBody {
  organization_name: string
  identifier_attribute: string
  admin_username?: string
}

//Create organization
router.post<unknown, unknown, ICreateOrganizationBody>(
  '/organizations',
  async (req, res, next) => {
    try {
      const cognitoResponse = await CognitoActions.createOrganization(req.body)
      const sqlResponse = await Organizations.createOrganization(req.body)
      if (req.body.admin_username) {
        Promise.all([
          CognitoActions.addUserToOrganization({
            username: req.body.admin_username,
            groupname: req.body.identifier_attribute + '0admin',
          }),
          CognitoActions.addUserToOrganization({
            username: req.body.admin_username,
            groupname: req.body.identifier_attribute,
          }),
        ])
      }

      res.status(200).json({
        status: 'ok',
        message: '🚀 ~ > organization created',
        data: { cognitoResponse, sqlResponse },
      })
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface IDeleteOrganizationBody {
  organization_name: string
  identifier_attribute: string
}

//Delete organization
router.delete<unknown, unknown, IDeleteOrganizationBody>(
  '/organizations',
  async (req, res, next) => {
    try {
      const cognitoResponse = await CognitoActions.deleteOrganization(req.body)
      const sqlResponse = await Organizations.deleteOrganization(req.body)
      res.status(200).json({
        status: 'ok',
        message: '🚀 ~ > organization deleted',
        data: { cognitoResponse, sqlResponse },
      })
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export default router
