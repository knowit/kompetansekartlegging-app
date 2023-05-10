import express from 'express'
import Category from './queries'
import { CategoryInput, DeleteCategoryInput, GetCategoryInput } from './types'

const router = express.Router()

// Create category
router.post<unknown, unknown, CategoryInput>('/', async (req, res, next) => {
  try {
    const createCategoryResponse = await Category.createCategory(req.body)

    res.status(201).json(createCategoryResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    if (req.query.id) {
      const getCategoryResponse = await Category.getCategory(
        req.query as GetCategoryInput
      )
      res.status(200).json(getCategoryResponse)
    } else {
      const listCategoriesResponse = await Category.listCategories()
      res.status(200).json(listCategoriesResponse)
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Update category with given id
router.patch<unknown, unknown, CategoryInput, GetCategoryInput>(
  '/:id',
  async (req, res, next) => {
    const { id } = req.query
    try {
      const updateCategoryResponse = await Category.updateCategory(id, req.body)

      res.status(200).json(updateCategoryResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Delete category with given id
router.delete<unknown, unknown, DeleteCategoryInput>(
  '/',
  async (req, res, next) => {
    try {
      const deleteCategoryResponse = await Category.deleteCategory(req.body)

      res.status(200).json(deleteCategoryResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as categoryRouter }
