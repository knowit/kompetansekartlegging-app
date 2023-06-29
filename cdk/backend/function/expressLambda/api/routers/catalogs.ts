import express from 'express'
import { getOrganization } from '../../utils/utils'
import { Catalogs } from '../queries'

const router = express.Router()

// Get active catalog by organization
router.get('/', async (req, res, next) => {
  try {
    const organization = getOrganization(req)
    const getCatalogResponse = await Catalogs.findActiveCatalogByOrganization({
      identifier_attribute: organization,
    })

    res.status(200).json(getCatalogResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export default router
