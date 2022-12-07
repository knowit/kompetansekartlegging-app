import express from 'express'
import Organization from './organizationQueries'

const router = express.Router()

//Get all organizations
router.get('/list', async (_req, res, next) => {
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

//Add a new organization
router.post<unknown, unknown, CreateOrganizationParams>(
  '/add',
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
  organizationId: string
}

//Delete organization
router.delete<unknown, unknown, DelReqParams>(
  '/remove',
  async (req, res, next) => {
    const { organizationId } = req.body
    try {
      const removeOrganizationResponse = await Organization.removeOrganization(
        organizationId
      )

      res.status(200).json(removeOrganizationResponse)
    } catch (err) {
      next(err)
      console.error(err)
    }
  }
)

export { router as organizationRouter }
