import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import {
  DeleteCatalogInput,
  Catalog,
  CatalogInput,
  GetCatalogInput,
  UpdateCatalogInput,
} from './types'

export const getAllCatalogs = async () => apiGET<Catalog>('/catalogs')

export const createCatalog = async (data: CatalogInput) =>
  apiPOST<Catalog>('/catalogs', { body: data })

export const deleteCatalog = async (id: DeleteCatalogInput) =>
  apiDELETE<Catalog>('/catalogs', { body: id })

export const updateCatalog = async (
  id: GetCatalogInput,
  data: UpdateCatalogInput
) => apiPATCH('/catalogs/:id', { queryStringParameters: id, body: data })
