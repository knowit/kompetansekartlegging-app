import { API, Auth } from 'aws-amplify'
import {
  Mutation,
  // ListOrganizationsQuery,
  // CreateOrganizationMutation,
  // UpdateOrganizationMutation,
  // DeleteOrganizationMutation
  Query,
} from '../../API'
import { createOrganization, deleteOrganization } from '../../graphql/mutations'
import { listOrganizations } from '../../graphql/queries'
import { callGraphQL } from '../../helperFunctions'
import { ApiResponse } from '../AdminPanel/adminApi'
import i18n from '../../i18n/i18n'
import { OrganizationInfo } from './SuperAdminTypes'

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

export const addOrganization = async (
  organization: OrganizationInfo,
  adminEmail: string
) =>
  new Promise(async (resolve, reject) => {
    try {
      await callGraphQL<Mutation>(createOrganization, {
        input: {
          id: organization.id,
          orgname: organization.name,
          identifierAttribute: organization.identifierAttribute,
        },
      })
      try {
        await API.get('configureNewOrganizationAPI', '', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${(await Auth.currentSession())
              .getAccessToken()
              .getJwtToken()}`,
          },
          queryStringParameters: {
            organization_id: `${organization.id}`,
            admin_email: `${adminEmail}`,
          },
        })
      } catch (e) {
        reject(
          i18n.t('superAdminApi.theNewOrganizationWasNotProperlyConfigured', {
            organizationName: organization.name,
          })
        )
      }

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
