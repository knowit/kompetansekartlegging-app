import { apiGET, apiPOST, apiPATCH, apiDELETE } from '../client'
import { Group, GroupList, User, UserList } from './types'

export const getAllGroups = async () => apiGET<GroupList>('/groups')

export const getAllUsersInGroup = async (groupId: string) =>
  apiGET<UserList>('/groups/users', { queryStringParameters: { groupId } })

type CreateGroupInput = Omit<Group, 'id'>
export const createGroup = async (groupInfo: CreateGroupInput) =>
  apiPOST<Group>('/groups', { body: groupInfo })

type AddUserToGroupInput = Omit<User, 'groupid'>
export const addUserToGroup = async (
  groupId: string,
  userInfo: AddUserToGroupInput
) =>
  apiPOST<User>('/groups/user', {
    queryStringParameters: { groupId },
    body: userInfo,
  })

export const updateGroupLeader = async (
  groupId: string,
  groupleaderusername: string
) =>
  apiPATCH<Group>('/groups', {
    queryStringParameters: { groupId },
    body: { groupleaderusername },
  })

export const deleteGroup = async (groupId: string) =>
  apiDELETE<Group>('/groups', { queryStringParameters: { groupId } })

export const deleteUserFromGroup = async (userId: string) =>
  apiDELETE<User>('/groups/user', { queryStringParameters: { userId } })
