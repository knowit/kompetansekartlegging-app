import express from 'express'
import Organization from './organizationQueries'

const router = express.Router()

router.get('/list', async (_req, res, next) => {
  try {
    const listOrganizationsResponse = await Organization.listOrganizations()

    res.status(200).json(listOrganizationsResponse)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

interface addOrganizationParams {
  id: string
  orgname: string
  identifierAttribute: string
  owner: string
}

router.post<unknown, unknown, addOrganizationParams>(
  '/add',
  async (req, res, next) => {
    const { id, orgname, identifierAttribute } = req.body
    try {
      const addOrganizationResponse = await Organization.addOrganization(
        id,
        orgname,
        identifierAttribute
      )

      res.status(200).json(addOrganizationResponse)
    } catch (err) {
      next(err)
      console.error(err)
    }
  }
)

router.delete('/remove', async (req, res, next) => {
  const { id } = req.body
  try {
    const removeOrganizationResponse = await Organization.removeOrganization(id)

    res.status(200).json(removeOrganizationResponse)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

export { router as organizationRouter }
