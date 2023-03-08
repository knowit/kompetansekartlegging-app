import { apiDELETE, apiGET, apiPOST } from '../client'
import {
  DeleteOrganizationInput,
  GetOrganizationInput,
  Organization,
  OrganizationInput,
} from './types'

export const getAllOrganizations = async () =>
  apiGET<Organization[]>('/organizations')

export const getOrganizationByID = async (id: GetOrganizationInput) =>
  apiGET<Organization>('/organizations/:id', {
    queryStringParameters: id,
  })

export const createOrganization = async (organizationInfo: OrganizationInput) =>
  apiPOST<Organization>('/organizations', {
    body: organizationInfo,
  })

export const deleteOrganization = async (id: DeleteOrganizationInput) =>
  apiDELETE<Organization>('/organizations', {
    body: id,
  })
