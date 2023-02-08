import express from 'express'
import Organization from './queries'

const router = express.Router()

//Get all organizations
router.get('/', async (_req, res, next) => {
  try {
    const listOrganizationsResponse = await Organization.listOrganizations()

    res.status(200).json(listOrganizationsResponse)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

interface CreateOrganizationParams {
  organizationId: string
  organizationName: string
  identifierAttribute: string
}

// Create a new organization
router.post<unknown, unknown, CreateOrganizationParams>(
  '/',
  async (req, res, next) => {
    const { organizationId, organizationName, identifierAttribute } = req.body
    try {
      const addOrganizationResponse = await Organization.addOrganization(
        organizationId,
        organizationName,
        identifierAttribute
      )

      res.status(200).json(addOrganizationResponse)
    } catch (err) {
      next(err)
      console.error(err)
    }
  }
)

interface DelReqParams {
  orgId: string
}

// Delete organization
router.delete<unknown, unknown, DelReqParams>('/', async (req, res, next) => {
  const { orgId } = req.body
  try {
    const removeOrganizationResponse = await Organization.removeOrganization(
      orgId
    )

    res.status(200).json(removeOrganizationResponse)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

export { router as organizationRouter }
