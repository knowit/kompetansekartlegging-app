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
      error: 'Could get get a list of organizations.',
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
      reject(`Kunne ikke legge til organisasjonen ${organization.name}.`)
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
      reject(`Kunne ikke slette organization ${organization.name}.`)
    }
  })
