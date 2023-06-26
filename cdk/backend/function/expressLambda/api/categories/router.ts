import express from 'express'
import { CategoryCatalogId, CategoryId } from '../../utils/types'
import Category from './queries'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    if (req.query.id) {
      const getCategoryResponse = await Category.getCategory(
        req.query as CategoryId
      )
      res.status(200).json(getCategoryResponse)
    } else if (req.query.catalog_id) {
      const getCategoryInCatalogResponse = await Category.getCategoryInCatalog(
        req.query as CategoryCatalogId
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
