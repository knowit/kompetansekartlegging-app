import { callGraphQL } from '../../helperFunctions'
import {
  // ListOrganizationsQuery,
  // CreateOrganizationMutation,
  // UpdateOrganizationMutation,
  // DeleteOrganizationMutation
  Query,
  Mutation,
} from '../../API'
import { listOrganizations } from '../../graphql/queries'
import { createOrganization, deleteOrganization } from '../../graphql/mutations'
import { OrganizationInfo } from './SuperAdminTypes'
import { ApiResponse } from '../AdminPanel/adminApi'
import i18n from '../../i18n/i18n'

export const getOrganizations = async (): Promise<
  ApiResponse<OrganizationInfo[]>
> => {
  try {
    const organizationsResult = await callGraphQL<Query>(listOrganizations)
    const organizations =
      organizationsResult.data?.listOrganizations?.items?.map(
        (item) =>
          ({
            id: item?.id,
            name: item?.orgname,
            identifierAttribute: item?.identifierAttribute,
          } as OrganizationInfo)
      )

    return {
      result: organizations || [],
    }
  } catch (e) {
    return {
      error: i18n.t('superAdminApi.couldNotGetAListOfOrganizations'),
    }
  }
}

export const addOrganization = async (organization: OrganizationInfo) =>
  new Promise(async (resolve, reject) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await callGraphQL<Mutation>(createOrganization, {
        input: {
          id: organization.id,
          orgname: organization.name,
          identifierAttribute: organization.identifierAttribute,
        },
      })
      resolve(null)
    } catch (e) {
      reject(
        i18n.t('superAdminApi.couldNotAddTheOrganization', {
          organizationName: organization.name,
        })
      )
    }
  })

export const removeOrganization = (organization: OrganizationInfo) =>
  new Promise(async (resolve, reject) => {
    try {
      await callGraphQL<Mutation>(deleteOrganization, {
        input: {
          id: organization.id,
        },
      })
      resolve(null)
    } catch (e) {
      reject(
        i18n.t('superAdminApi.couldNotDeleteTheOrganization', {
          organizationName: organization.name,
        })
      )
    }
  })
