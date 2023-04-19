import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import { GetOrganizationInput } from '../organizations/types'
import {
  DeleteCatalogInput,
  Catalog,
  CatalogInput,
  GetCatalogInput,
  UpdateCatalogInput,
} from './types'

export const getAllCatalogs = async () => apiGET<Catalog>('/catalogs')

export const getActiveCatalogByOrganization = async (
  id: GetOrganizationInput
) =>
  apiGET<Catalog>('/catalogs/org/:id', {
    queryStringParameters: id,
  })

export const createCatalog = async (data: CatalogInput) =>
  apiPOST<Catalog>('/catalogs', { body: data })

export const deleteCatalog = async (id: DeleteCatalogInput) =>
  apiDELETE<Catalog>('/catalogs', { body: id })

export const updateCatalog = async (
  id: GetCatalogInput,
  data: UpdateCatalogInput
) => apiPATCH('/catalogs/:id', { queryStringParameters: id, body: data })
