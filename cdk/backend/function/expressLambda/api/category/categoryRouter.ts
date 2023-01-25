import express from 'express'
import Category from './categoryQueries'

const router = express.Router()

interface GetReqParams {
  categoryId: string
}

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    const listCategoriesResponse = await Category.listCategories()

    res.status(200).json(listCategoriesResponse)
  } catch (err) {
    console.error(err)
  }
})

// Get single category from id
router.get<GetReqParams>('/:categoryId', async (req, res, next) => {
  try {
    const { categoryId } = req.params
    const getCategoryResponse = await Category.getCategory(categoryId)

    res.status(200).json(getCategoryResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

interface createCategoryBodyParams {
  text: string
  description: string
  index: number
  formDefinitionId: string
  organizationId: string
}

// Create category
router.post<unknown, unknown, createCategoryBodyParams>(
  '/',
  async (req, res, next) => {
    try {
      const createCategoryResponse = await Category.createCategory(req.body)

      res.status(201).json(createCategoryResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Update category with given id
router.patch<GetReqParams, unknown, createCategoryBodyParams>(
  '/:categoryId',
  async (req, res, next) => {
    const { categoryId } = req.params
    try {
      const updateCategoryResponse = await Category.updateCategory(categoryId, {
        ...req.body,
      })

      res.status(200).json(updateCategoryResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Delete category with given id
router.delete<GetReqParams>('/:categoryId', async (req, res, next) => {
  try {
    const { categoryId } = req.params
    const deleteCategoryResponse = await Category.deleteCategory(categoryId)

    res.status(200).json(deleteCategoryResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export { router as categoryRouter }
