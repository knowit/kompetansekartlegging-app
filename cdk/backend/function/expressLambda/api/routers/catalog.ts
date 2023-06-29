import express from 'express'
import { getOrganization } from '../../utils/utils'
import Catalog from '../queries/catalog'

const router = express.Router()

// Get active catalog by organization
router.get('/', async (req, res, next) => {
  try {
    const organization = getOrganization(req)
    const getCatalogResponse = await Catalog.findActiveCatalogByOrganization({
      identifier_attribute: organization,
    })

    res.status(200).json(getCatalogResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export { router as catalogRouter }
