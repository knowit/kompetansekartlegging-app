import express from 'express'
import {
  CatalogId,
  CatalogInput,
  UpdateCatalogInput,
} from '../../../utils/types'
import { getOrganization } from '../../../utils/utils'
import { Catalogs } from '../../queries'

const router = express.Router()

// Get all catalogs in organization
router.get('/', async (req, res, next) => {
  try {
    const organization = getOrganization(req)
    const listCatalogsInOrganizationResponse = await Catalogs.listCatalgosInOrganization(
      { identifier_attribute: organization }
    )

    res.status(200).json(listCatalogsInOrganizationResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Create
router.post<unknown, unknown, CatalogInput>('/', async (req, res, next) => {
  try {
    const organization = getOrganization<CatalogInput>(req)
    const createResponse = await Catalogs.createCatalog({
      identifier_attribute: organization,
      ...req.body,
    })

    res.status(200).json(createResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Delete
router.delete<unknown, unknown, CatalogId>('/', async (req, res, next) => {
  try {
    const deleteResponse = await Catalogs.deleteCatalog(req.body)

    res.status(200).json(deleteResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Update
router.patch<unknown, unknown, UpdateCatalogInput, CatalogId>(
  '/',
  async (req, res, next) => {
    try {
      const updateResponse = await Catalogs.updateCatalog(req.query, req.body)

      res.status(200).json(updateResponse)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

export default router
