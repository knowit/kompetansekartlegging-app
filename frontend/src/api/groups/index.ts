import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import {
  AddUserInput,
  DeleteGroupInput,
  DeleteUserInput,
  GetGroupInput,
  GetUsersInput,
  GroupInput,
  IGroup,
  IUser,
  UpdateGroupLeaderInput,
} from './types'

export const getAllGroups = async () => apiGET<IGroup[]>('/groups')

export const getAllUsersInGroup = async (groupid: GetUsersInput) =>
  apiGET<IUser[]>('/groups/users', { queryStringParameters: groupid })

export const addUserToGroup = async (
  id: GetGroupInput,
  userData: AddUserInput
) =>
  apiPOST<IUser>('/groups/:id/user', {
    queryStringParameters: id,
    body: userData,
  })

export const deleteUserFromGroup = async (username: DeleteUserInput) =>
  apiDELETE<IUser>('/groups/user', { body: username })

export const createGroup = async (data: GroupInput) =>
  apiPOST<IGroup>('/groups', { body: data })

export const updateGroupLeader = async (
  id: GetGroupInput,
  data: UpdateGroupLeaderInput
) =>
  apiPATCH<IGroup>('/groups', {
    queryStringParameters: id,
    body: data,
  })

export const deleteGroup = async (id: DeleteGroupInput) =>
  apiDELETE<IGroup>('/groups', { body: id })
