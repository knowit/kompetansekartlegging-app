import express from 'express'
import { CategoryId, CategoryInput } from '../../../utils/types'
import { Categories } from '../../queries'
const router = express.Router()

// Create category
router.post<unknown, unknown, CategoryInput>('/', async (req, res, next) => {
  try {
    const createCategoryResponse = await Categories.createCategory(req.body)

    res.status(201).json(createCategoryResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Update category with given id
router.patch<unknown, unknown, CategoryInput, CategoryId>(
  '/',
  async (req, res, next) => {
    const { id } = req.query
    try {
      const updateCategoryResponse = await Categories.updateCategory(
        id,
        req.body
      )

      res.status(200).json(updateCategoryResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Delete category with given id
router.delete<unknown, unknown, CategoryId>('/', async (req, res, next) => {
  try {
    const deleteCategoryResponse = await Categories.deleteCategory(req.body)

    res.status(200).json(deleteCategoryResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export default router