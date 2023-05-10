import { apiDELETE, apiGET, apiPOST } from '../client'
import {
  DeleteOrganizationInput,
  GetOrganizationInput,
  Organization,
  OrganizationInput,
} from './types'

const path = '/organizations'

export const getAllOrganizations = async () => apiGET<Organization[]>(path)

export const getOrganizationByID = async (id: GetOrganizationInput) =>
  apiGET<Organization>(`${path}/:id`, {
    queryStringParameters: id,
  })

export const createOrganization = async (organizationInfo: OrganizationInput) =>
  apiPOST<Organization>(path, {
    body: organizationInfo,
  })

export const deleteOrganization = async (id: DeleteOrganizationInput) =>
  apiDELETE<Organization>(path, {
    body: id,
  })
