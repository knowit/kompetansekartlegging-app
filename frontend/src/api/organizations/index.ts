import { apiDELETE, apiGET, apiPOST } from '../client'
import {
  DeleteOrganizationInput,
  Organization,
  OrganizationInput,
} from './types'

export const getAllOrganizations = async () =>
  apiGET<Organization[]>('/organizations')

export const createOrganization = async (organizationInfo: OrganizationInput) =>
  apiPOST<Organization>('/organizations', {
    body: organizationInfo,
  })

export const deleteOrganization = async (id: DeleteOrganizationInput) =>
  apiDELETE<Organization>('/organizations', {
    body: id,
  })
