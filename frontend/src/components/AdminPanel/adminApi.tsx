import { API, Auth } from 'aws-amplify'
import {
  ADMIN_COGNITOGROUP_SUFFIX,
  GROUPLEADER_COGNITOGROUP_SUFFIX,
  SUPER_ADMIN_COGNITO_GROUP,
} from '../../constants'
import i18n from '../../i18n/i18n'

export interface Response<T> {
  result: T
}

export interface Failure {
  error: string
}

export type ApiResponse<T> = Response<T> | Failure

export const removeUserFromGroup = async (
  groupname: string,
  username: string
): Promise<ApiResponse<any>> => {
  const apiName = 'AdminQueries'
  const path = '/removeUserFromGroup'
  const myInit = {
    body: {
      groupname,
      username,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
  }

  try {
    await API.post(apiName, path, myInit)
    return {
      result: i18n.t('adminApi.result.removedUserFromGroup', {
        username: username,
        groupname: groupname,
      }),
    }
  } catch (e) {
    return {
      error: i18n.t('adminApi.error.couldNotRemoveUserFromGroup', {
        username: username,
        groupname: groupname,
      }),
    }
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const removeGroupLeader = async (user: any, org: any) =>
  await removeUserFromGroup(`${org}0groupLeader`, user.Username)
const removeAdmin = async (user: any, org: any) =>
  await removeUserFromGroup(`${org}0admin`, user.Username)
/* eslint-enable @typescript-eslint/no-unused-vars */

export const addUserToGroup = async (
  groupname: string,
  username: string
): Promise<ApiResponse<any>> => {
  const apiName = 'AdminQueries'
  const path = '/addUserToGroup'
  const myInit = {
    body: {
      groupname,
      username,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
  }

  try {
    await API.post(apiName, path, myInit)
    return {
      result: i18n.t('adminApi.result.addedUserToGroup', {
        username: username,
        groupname: groupname,
      }),
    }
  } catch (e) {
    return {
      error: i18n.t('adminApi.error.couldNotAddUserToGroup', {
        username: username,
        groupname: groupname,
      }),
    }
  }
}

const listUsersInGroup = async (
  groupname: string
): Promise<ApiResponse<any[]>> => {
  const apiName = 'AdminQueries'
  const path = '/listUsersInGroup'
  const myInit: any = {
    queryStringParameters: {
      groupname,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
  }

  try {
    let response = await API.get(apiName, path, myInit)
    const Users: any[] = []
    let nextToken = response.NextToken ? response.NextToken : null
    Users.push(...response.Users)
    while (nextToken) {
      myInit.queryStringParameters['token'] = nextToken
      response = await API.get(apiName, path, myInit)
      Users.push(...response.Users)
      if (response.NextToken && response.NextToken !== nextToken) {
        nextToken = response.NextToken
      } else {
        nextToken = null
      }
      // nextToken = () ? response.NextToken : null;
    }
    return { result: Users }
  } catch (e) {
    console.log(e)
    return {
      error: i18n.t('adminApi.error.couldNotGetAListOfUsersInGroup', {
        groupname: groupname,
      }),
    }
  }
}

const listAllUsersInOrganization = async (organizationID: string) =>
  await listUsersInGroup(organizationID)
const listGroupLeadersInOrganization = async (organizationID: string) =>
  await listUsersInGroup(`${organizationID}${GROUPLEADER_COGNITOGROUP_SUFFIX}`)
const listGroupLeaders = async () => await listUsersInGroup('groupLeader')
const listAdminsInOrganization = async (organizationID: string) =>
  await listUsersInGroup(`${organizationID}${ADMIN_COGNITOGROUP_SUFFIX}`)
const listSuperAdmins = async () =>
  await listUsersInGroup(SUPER_ADMIN_COGNITO_GROUP)

const listAllUsers = async (limit = 60): Promise<ApiResponse<any[]>> => {
  let nextToken = ''
  let allUsers: any[] = []
  try {
    do {
      const apiName = 'AdminQueries'
      const path = '/listUsers'
      const variables = {
        queryStringParameters: {
          limit: `${limit}`,
          token: nextToken,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
      }
      const res = await API.get(apiName, path, variables)
      const { Users, NextToken } = res
      nextToken = NextToken
      allUsers = [...allUsers, ...Users]
    } while (nextToken)
  } catch (e) {
    return { error: i18n.t('adminApi.error.couldNotGetAListOfAllUsers') }
  }
  return { result: allUsers }
}

const getUserExists = async (username: string) => {
  const apiName = 'AdminQueries'
  const path = '/getUserExists'
  const myInit = {
    queryStringParameters: {
      username,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
  }

  return await API.get(apiName, path, myInit)
}

const listAllOrganizationAdministrators = async (): Promise<
  ApiResponse<any[]>
> => {
  const apiName = 'AdminQueries'
  const path = '/listAllOrganizationAdministrators'
  const myInit = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
  }

  try {
    const res = await API.get(apiName, path, myInit)
    return { result: res.Admins }
  } catch (e) {
    return {
      error: i18n.t('adminApi.error.couldNotGetAListOfAllAdministrators'),
    }
  }
}

const anonymizeUser = async (
  username: string,
  orgId: string
): Promise<ApiResponse<any[]>> => {
  const apiName = 'AdminQueries'
  const path = '/anonymizeUser'
  const myInit = {
    body: {
      username,
      orgId,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
  }

  return await API.post(apiName, path, myInit)
}

export {
  getUserExists,
  listAllUsers,
  listAllUsersInOrganization,
  listGroupLeaders,
  listGroupLeadersInOrganization,
  listSuperAdmins,
  listAdminsInOrganization,
  listAllOrganizationAdministrators,
  anonymizeUser,
}
