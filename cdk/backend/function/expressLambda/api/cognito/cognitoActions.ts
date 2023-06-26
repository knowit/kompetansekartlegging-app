/* eslint-disable */
/*
 * Copyright 2019-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import { CognitoIdentityServiceProvider } from 'aws-sdk'
import {
  GroupNameType,
  PaginationKey,
  QueryLimitType,
  SearchPaginationTokenType,
  UsernameType,
} from 'aws-sdk/clients/cognitoidentityserviceprovider'
import { Body } from './types'

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider()
const userPoolId = process.env.USERPOOL

// async function addUserToGroup(
//   username: UsernameType,
//   groupname: GroupNameType
// )
const addUserToOrganization = async ({ username, groupname }: Body) => {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId!,
    Username: username,
  }

  try {
    const result = await cognitoIdentityServiceProvider
      .adminAddUserToGroup(params)
      .promise()
    return {
      status: 'ok',
      message: `🚀 ~> Success adding ${username} to ${groupname}`,
      data: null,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function removeUserFromOrganization({ username, groupname }: Body) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId!,
    Username: username,
  }

  try {
    const result = await cognitoIdentityServiceProvider
      .adminRemoveUserFromGroup(params)
      .promise()
    return {
      status: 'ok',
      message: `🚀 ~ > Removed ${username} from ${groupname}`,
      data: null,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

interface ICreateOrganizationParams {
  identifier_attribute: string
}

// Create an orangization
const createOrganization = async ({
  identifier_attribute,
}: ICreateOrganizationParams) => {
  const params = {
    GroupName: identifier_attribute,
    UserPoolId: userPoolId!,
  }
  const groupLeaderParams = {
    GroupName: identifier_attribute + '0groupLeader',
    UserPoolId: userPoolId!,
  }
  const adminParams = {
    GroupName: identifier_attribute + '0admin',
    UserPoolId: userPoolId!,
  }
  try {
    await Promise.all([
      cognitoIdentityServiceProvider.createGroup(params).promise(),
      cognitoIdentityServiceProvider.createGroup(groupLeaderParams).promise(),
      cognitoIdentityServiceProvider.createGroup(adminParams).promise(),
    ])

    return {
      status: 'ok',
      message: `🚀 ~ > Created ${identifier_attribute}`,
      data: null,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

interface IDeleteOrganizationParams {
  identifier_attribute: string
}

const deleteOrganization = async ({
  identifier_attribute,
}: IDeleteOrganizationParams) => {
  const params = {
    GroupName: identifier_attribute,
    UserPoolId: userPoolId!,
  }
  const groupLeaderParams = {
    GroupName: identifier_attribute + '0groupLeader',
    UserPoolId: userPoolId!,
  }
  const adminParams = {
    GroupName: identifier_attribute + '0admin',
    UserPoolId: userPoolId!,
  }
  try {
    await Promise.all([
      cognitoIdentityServiceProvider.deleteGroup(params).promise(),
      cognitoIdentityServiceProvider.deleteGroup(groupLeaderParams).promise(),
      cognitoIdentityServiceProvider.deleteGroup(adminParams).promise(),
    ])

    return {
      status: 'ok',
      message: `🚀 ~ > Deleted ${identifier_attribute}`,
      data: null,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function getUser(username: UsernameType) {
  const params = {
    UserPoolId: userPoolId!,
    Username: username,
  }

  try {
    const result = await cognitoIdentityServiceProvider
      .adminGetUser(params)
      .promise()
    return result
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function listUsers(
  Limit?: QueryLimitType,
  PaginationToken?: SearchPaginationTokenType
) {
  const params = {
    UserPoolId: userPoolId!,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken }),
  }

  try {
    const result = await cognitoIdentityServiceProvider
      .listUsers(params)
      .promise()

    // Rename to NextToken for consistency with other Cognito APIs
    const response = { NextToken: result.PaginationToken, ...result }
    response.NextToken = response.PaginationToken
    delete response.PaginationToken

    return {
      status: 'ok',
      data: response,
      message: '🚀 ~ > All users in cognito user pool',
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function listOrganizations(
  Limit?: QueryLimitType,
  PaginationToken?: SearchPaginationTokenType
) {
  const params = {
    UserPoolId: userPoolId!,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken }),
  }

  console.log('Attempting to list groups')

  try {
    const result = await cognitoIdentityServiceProvider
      .listGroups(params)
      .promise()

    return {
      status: 'ok',
      data: result,
      message: '🚀 ~ > All organizations in cognito user pool',
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

const listAdminsInAllOrganizations = async (
  Limit?: QueryLimitType,
  PaginationToken?: SearchPaginationTokenType
) => {
  try {
    const organizations = await listOrganizations(Limit, PaginationToken)
    const groups = organizations.data.Groups?.filter(group =>
      group.GroupName?.includes('0admin')
    )
    const allAdmins = []

    for (const group of groups!) {
      // TODO: legge til alle admins i en liste, finne ut av hvorfor det er dobbelt promise
      console.log(`Henter admins for ${group.GroupName}`)

      const admins = await listUsersInOrganization(group.GroupName!)
      console.log(`Admins var ${admins.data.Users?.join(', ')}`)

      console.log(JSON.stringify(admins, null, 2))

      allAdmins.push(admins.data.Users)

      return allAdmins
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function listOrganizationsForUser(
  username: UsernameType,
  Limit: QueryLimitType,
  NextToken: PaginationKey
) {
  const params = {
    UserPoolId: userPoolId!,
    Username: username,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  }

  console.log(`Attempting to list groups for ${username}`)

  try {
    const result = await cognitoIdentityServiceProvider
      .adminListGroupsForUser(params)
      .promise()
    /**
     * We are filtering out the results that seem to be innapropriate for client applications
     * to prevent any informaiton disclosure. Customers can modify if they have the need.
     */
    result.Groups?.forEach(val => {
      delete val.UserPoolId,
        delete val.LastModifiedDate,
        delete val.CreationDate,
        delete val.Precedence,
        delete val.RoleArn
    })

    return result
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function listUsersInOrganization(
  groupname: GroupNameType,
  Limit?: QueryLimitType,
  NextToken?: PaginationKey
) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId!,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  }

  console.log(`Attempting to list users in group ${groupname}`)

  try {
    const result = await cognitoIdentityServiceProvider
      .listUsersInGroup(params)
      .promise()

    return {
      status: 'ok',
      message: `🚀 ~ > All users in group ${groupname}`,
      data: result,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

// Remove group id from user attributes
const removeGroupIdFromUserAttributes = async (username: string) => {
  const params = {
    UserPoolId: userPoolId!,
    Username: username,
    UserAttributes: [
      {
        Name: 'custom:groupId',
        Value: '',
      },
    ],
  }
  try {
    const result = await cognitoIdentityServiceProvider
      .adminUpdateUserAttributes(params)
      .promise()
    return {
      status: 'ok',
      message: 'Removed user from group',
      data: null,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

const addGroupIdToUserAttributes = async ({
  username,
  groupId,
}: {
  username: string
  groupId: string
}) => {
  const params = {
    UserPoolId: userPoolId!,
    Username: username,
    UserAttributes: [
      {
        Name: 'custom:groupId',
        Value: groupId,
      },
    ],
  }
  try {
    const result = await cognitoIdentityServiceProvider
      .adminUpdateUserAttributes(params)
      .promise()
    return {
      status: 'ok',
      message: `Added user to group with id ${groupId}`,
      data: null,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export {
  addGroupIdToUserAttributes,
  addUserToOrganization,
  createOrganization,
  deleteOrganization,
  getUser,
  listAdminsInAllOrganizations,
  listOrganizations,
  listOrganizationsForUser,
  listUsers,
  listUsersInOrganization,
  removeGroupIdFromUserAttributes,
  removeUserFromOrganization,
}
