import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import {
  Category,
  CategoryInput,
  DeleteCategoryInput,
  GetCategoryInput,
} from './types'

export const createCategory = async (categoryInfo: CategoryInput) =>
  apiPOST<Category>('/categories', {
    body: categoryInfo,
  })

export const getAllCategories = async () => apiGET<Category[]>('/categories')

export const getCategoryById = async (id: GetCategoryInput) =>
  apiGET<Category>('/categories/:id', {
    queryStringParameters: id,
  })

export const updateCategory = async (
  id: GetCategoryInput,
  data: CategoryInput
) =>
  apiPATCH<Category>('/categories/:id', {
    queryStringParameters: id,
    body: data,
  })

export const deleteCategory = async (id: DeleteCategoryInput) =>
  apiDELETE<Category>('/categories', {
    body: id,
  })
