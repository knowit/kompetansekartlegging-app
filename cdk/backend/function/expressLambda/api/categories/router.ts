import express from 'express'
import Category from './queries'
import { GetCategoryInCatalogInput, GetCategoryInput } from './types'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    if (req.query.id) {
      const getCategoryResponse = await Category.getCategory(
        req.query as GetCategoryInput
      )
      res.status(200).json(getCategoryResponse)
    } else if (req.query.catalog_id) {
      const getCategoryInCatalogResponse = await Category.getCategoryInCatalog(
        req.query as GetCategoryInCatalogInput
      )
      res.status(200).json(getCategoryInCatalogResponse)
    } else {
      const listCategoriesResponse = await Category.listCategories()
      res.status(200).json(listCategoriesResponse)
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export { router as categoryRouter }
