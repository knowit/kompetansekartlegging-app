import express from 'express'
import { CategoryCatalogId, CategoryId } from '../../utils/types'
import { getOrganization } from '../../utils/utils'
import { Categories } from '../queries'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    if (req.query.id) {
      const getCategoryResponse = await Categories.getCategory(
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
      const getCategoryInCatalogResponse = await Categories.getCategoryInCatalog(
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

    const listCategoriesResponse = await Categories.listCategoriesInOrganization(
      organization
    )
    return res.status(200).json(listCategoriesResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export default router
