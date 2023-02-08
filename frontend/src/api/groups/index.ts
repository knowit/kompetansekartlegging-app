import { Group, User } from '../../API'
import { apiGET, apiPOST, apiPATCH, apiDELETE } from '../client'
import {
  AddUserInput,
  DeleteGroupInput,
  DeleteUserInput,
  GetGroupInput,
  GetUsersInput,
  GroupInput,
  UpdateGroupLeaderInput,
} from './types'

export const getAllGroups = async () => apiGET<Group[]>('/groups')

export const getAllUsersInGroup = async ({ groupid }: GetUsersInput) =>
  apiGET<User[]>('/groups/users', { queryStringParameters: { groupid } })

export const addUserToGroup = async (
  { id: groupid }: GetGroupInput,
  { id, organizationid }: AddUserInput
) =>
  apiPOST<User>('/groups/:id/user', {
    queryStringParameters: { id: groupid },
    body: { id, organizationid },
  })

export const deleteUserFromGroup = async ({ id }: DeleteUserInput) =>
  apiDELETE<User>('/groups/user', { body: { id } })

export const createGroup = async ({
  organizationid,
  groupleaderusername,
}: GroupInput) =>
  apiPOST<Group>('/groups', { body: { organizationid, groupleaderusername } })

export const updateGroupLeader = async (
  { id }: GetGroupInput,
  { groupleaderusername }: UpdateGroupLeaderInput
) =>
  apiPATCH<Group>('/groups', {
    queryStringParameters: { id },
    body: { groupleaderusername },
  })

export const deleteGroup = async ({ id }: DeleteGroupInput) =>
  apiDELETE<Group>('/groups', { body: { id } })
