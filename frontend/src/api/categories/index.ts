import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import {
  Category,
  CategoryInput,
  DeleteCategoryInput,
  GetCategoryInput,
} from './types'

const path = '/categories'

export const createCategory = async (categoryInfo: CategoryInput) =>
  apiPOST<Category>(path, {
    body: categoryInfo,
  })

export const getAllCategories = async () => apiGET<Category[]>(path)

export const getCategoryById = async (id: GetCategoryInput) =>
  apiGET<Category>(`${path}/:id`, {
    queryStringParameters: id,
  })

export const updateCategory = async (
  id: GetCategoryInput,
  data: CategoryInput
) =>
  apiPATCH<Category>(`${path}/:id`, {
    queryStringParameters: id,
    body: data,
  })

export const deleteCategory = async (id: DeleteCategoryInput) =>
  apiDELETE<Category>(path, {
    body: id,
  })
