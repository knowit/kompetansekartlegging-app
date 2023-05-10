import express from 'express'
import Organization from './queries'
import {
  DeleteOrganizationInput,
  GetOrganizationInput,
  OrganizationInput,
} from './types'

const router = express.Router()

//Get all organizations
router.get('/', async (req, res, next) => {
  try {
    if (req.query.id) {
      const getOrganizationResponse = await Organization.getOrganization(
        req.query as GetOrganizationInput
      )
      res.status(200).json(getOrganizationResponse)
    } else {
      const listOrganizationsResponse = await Organization.listOrganizations()

      res.status(200).json(listOrganizationsResponse)
    }
  } catch (err) {
    next(err)
    console.error(err)
  }
})

// Create a new organization
router.post<unknown, unknown, OrganizationInput>(
  '/',
  async (req, res, next) => {
    try {
      const addOrganizationResponse = await Organization.createOrganization(
        req.body
      )

      res.status(200).json(addOrganizationResponse)
    } catch (err) {
      next(err)
      console.error(err)
    }
  }
)

// Delete organization
router.delete<unknown, unknown, DeleteOrganizationInput>(
  '/',
  async (req, res, next) => {
    try {
      const removeOrganizationResponse = await Organization.deleteOrganization(
        req.body
      )

      res.status(200).json(removeOrganizationResponse)
    } catch (err) {
      next(err)
      console.error(err)
    }
  }
)

export { router as organizationRouter }
