import { apiDELETE, apiGET, apiPOST } from '../client'
import { Category, CategoryInput, CategoryList } from './types'

export const getAllCategories = async () => apiGET<CategoryList>('/categories')

export const getCategoryById = async (categoryId: string) =>
  apiGET<Category>('/categories/:categoryId', {
    queryStringParameters: { categoryId },
  })

export const createCategory = async (categoryInfo: CategoryInput) =>
  apiPOST<Category>('/categories', {
    body: categoryInfo,
  })

export const deleteCategory = async (categoryId: string) =>
  apiDELETE<Category>('/categories', {
    body: { categoryId },
  })
