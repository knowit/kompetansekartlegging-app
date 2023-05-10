import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import { GetOrganizationInput } from '../organizations/types'
import {
  Catalog,
  CatalogInput,
  DeleteCatalogInput,
  GetCatalogInput,
  UpdateCatalogInput,
} from './types'

const path = '/catalogs'

export const getAllCatalogs = async () => apiGET<Catalog>(path)

export const getActiveCatalogByOrganization = async (
  id: GetOrganizationInput
) =>
  apiGET<Catalog>('/catalogs/org/:id', {
    queryStringParameters: id,
  })

export const createCatalog = async (data: CatalogInput) =>
  apiPOST<Catalog>(path, { body: data })

export const deleteCatalog = async (id: DeleteCatalogInput) =>
  apiDELETE<Catalog>(path, { body: id })

export const updateCatalog = async (
  id: GetCatalogInput,
  data: UpdateCatalogInput
) => apiPATCH(`${path}/:id`, { queryStringParameters: id, body: data })
