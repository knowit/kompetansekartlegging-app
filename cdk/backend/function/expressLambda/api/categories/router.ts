import express from 'express'
import { CategoryCatalogId, CategoryId } from '../../utils/types'
import { getOrganization } from '../utils'
import Category from './queries'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    if (req.query.id) {
      const getCategoryResponse = await Category.getCategory(
        req.query as CategoryId
      )
      return res.status(200).json(getCategoryResponse)
    }
    next()
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    if (req.query.catalog_id) {
      const getCategoryInCatalogResponse = await Category.getCategoryInCatalog(
        req.query as CategoryCatalogId
      )
      return res.status(200).json(getCategoryInCatalogResponse)
    }
    next()
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const organization = getOrganization(req)

    const listCategoriesResponse = await Category.listCategoriesInOrganization(
      organization
    )
    return res.status(200).json(listCategoriesResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export { router as categoryRouter }
