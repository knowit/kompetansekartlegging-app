import { apiDELETE, apiGET, apiPOST } from '../client'
import { Organization, OrganizationList } from './types'

export const getAllOrganizations = async () =>
  apiGET<OrganizationList>('/organizations')

type OrganizationInput = Omit<Organization, 'id'>
export const createOrganization = async (organizationInfo: OrganizationInput) =>
  apiPOST<OrganizationList>('/organizations', {
    body: organizationInfo,
  })

export const deleteOrganization = async (organizationId: string) =>
  apiDELETE<OrganizationList>('/organizations/:organizationId', {
    body: { organizationId },
  })
