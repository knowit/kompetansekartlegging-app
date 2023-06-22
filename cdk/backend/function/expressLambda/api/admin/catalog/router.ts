import express from 'express'
import Catalog from '../../catalog/queries'
import {
  CatalogInput,
  DeleteCatalogInput,
  GetCatalogInput,
  UpdateCatalogInput,
} from '../../catalog/types'

const router = express.Router()

// Create
router.post<unknown, unknown, CatalogInput>('/', async (req, res, next) => {
  try {
    const createResponse = await Catalog.createCatalog(req.body)

    res.status(200).json(createResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Delete
router.delete<unknown, unknown, DeleteCatalogInput>(
  '/',
  async (req, res, next) => {
    try {
      const deleteResponse = await Catalog.deleteCatalog(req.body)

      res.status(200).json(deleteResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Update
router.patch<unknown, unknown, UpdateCatalogInput, GetCatalogInput>(
  '/',
  async (req, res, next) => {
    try {
      const updateResponse = await Catalog.updateCatalog(req.query, req.body)

      res.status(200).json(updateResponse)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

export { router as adminCatalogsRouter }
