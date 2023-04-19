import { Group, User } from '../../API'
import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import {
  AddUserInput,
  DeleteGroupInput,
  DeleteUserInput,
  GetGroupInput,
  GetUsersInput,
  GroupInput,
  UpdateGroupLeaderInput,
} from './types'

const path = '/groups'

export const getAllGroups = async () => apiGET<Group[]>(path)

export const getAllUsersInGroup = async (groupid: GetUsersInput) =>
  apiGET<User[]>(`${path}/users`, { queryStringParameters: groupid })

export const addUserToGroup = async (
  id: GetGroupInput,
  userData: AddUserInput
) =>
  apiPOST<User>(`${path}/:id/user`, {
    queryStringParameters: id,
    body: userData,
  })

export const deleteUserFromGroup = async (id: DeleteUserInput) =>
  apiDELETE<User>(`${path}/user`, { body: id })

export const createGroup = async (data: GroupInput) =>
  apiPOST<Group>(path, { body: data })

export const updateGroupLeader = async (
  id: GetGroupInput,
  data: UpdateGroupLeaderInput
) =>
  apiPATCH<Group>(path, {
    queryStringParameters: id,
    body: data,
  })

export const deleteGroup = async (id: DeleteGroupInput) =>
  apiDELETE<Group>(path, { body: id })
