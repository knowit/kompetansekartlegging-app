import { v4 as uuidv4 } from 'uuid'

import { callGraphQL } from '../../helperFunctions'
import {
  User,
  // UsersByGroupQuery,
  Query,
  Mutation,
  Group,
  // ListGroupsQuery,
  // CreateGroupMutation,
  // DeleteGroupMutation,
  // UpdateGroupMutation,
  // ListUsersQuery,
  // CreateUserMutation,
  // DeleteUserMutation,
  // UpdateUserMutation,
} from '../../API'
import { usersByGroup, listGroups, listUsers } from '../../graphql/queries'
import {
  createGroup,
  deleteGroup,
  updateGroup,
  createUser,
  deleteUser,
  updateUser,
} from '../../graphql/mutations'
import { ApiResponse } from './adminApi'
import {
  ADMIN_COGNITOGROUP_SUFFIX,
  GROUPLEADER_COGNITOGROUP_SUFFIX,
} from '../../constants'
import i18n from '../../i18n/i18n'

const getGroupMembers = async (
  groupID: string
): Promise<ApiResponse<User[]>> => {
  try {
    const usersGQ = await callGraphQL<Query>(usersByGroup, {
      input: {
        groupID,
      },
    })
    const users = usersGQ?.data?.usersByGroup?.items?.map(
      (user) =>
        ({
          id: user?.id,
          groupID: user?.groupID,
        } as User)
    )

    return { result: users || [] }
  } catch (e) {
    return {
      error: i18n.t('groupsApi.couldNotGetMembersOfGroupWithID', {
        groupID: groupID,
      }),
    }
  }
}

const listAllGroups = async (): Promise<ApiResponse<Group[]>> => {
  try {
    const groupsGQ = await callGraphQL<Query>(listGroups)
    const groups = groupsGQ?.data?.listGroups?.items?.map(
      (group) =>
        ({
          id: group?.id,
          groupLeaderUsername: group?.groupLeaderUsername,
        } as Group)
    )

    return { result: groups || [] }
  } catch (e) {
    return { error: i18n.t('groupsApi.couldNotGetAListOfAllGroups') }
  }
}

const listAllUsers = async (): Promise<ApiResponse<User[]>> => {
  let nextToken = ''
  let allUsers: any[] = []
  try {
    do {
      const usersGQ = await callGraphQL<Query>(listUsers, {
        nextToken: nextToken || null,
      })
      nextToken = usersGQ?.data?.listUsers?.nextToken || ''
      const users = usersGQ?.data?.listUsers?.items?.map(
        (user) =>
          ({
            id: user?.id,
            groupID: user?.groupID,
          } as User)
      )
      allUsers = [...allUsers, ...(users || [])]
    } while (nextToken)
  } catch (e) {
    console.error(e)
    return { error: i18n.t('groupsApi.couldNotGetAListOfAllUsers') }
  }
  return { result: allUsers }
}

const addUserToGroup = async (
  id: string,
  groupID: string,
  orgID: string
): Promise<ApiResponse<User>> => {
  try {
    const userGQ = await callGraphQL<Mutation>(createUser, {
      input: {
        id,
        groupID,
        organizationID: orgID,
        orgAdmins: `${orgID}${ADMIN_COGNITOGROUP_SUFFIX}`,
        orgGroupLeaders: `${orgID}${GROUPLEADER_COGNITOGROUP_SUFFIX}`,
      },
    })
    const user = userGQ?.data?.createUser as User
    return { result: user || null }
  } catch (e) {
    return {
      error: i18n.t('groupsApi.couldNotAddUserWithIDToGroupWithID', {
        userID: id,
        groupID: groupID,
      }),
    }
  }
}

const updateUserGroup = async (
  id: string,
  groupID: string
): Promise<ApiResponse<User>> => {
  try {
    const userGQ = await callGraphQL<Mutation>(updateUser, {
      input: {
        id,
        groupID,
      },
    })
    const user = userGQ?.data?.updateUser as User
    return { result: user || null }
  } catch (e) {
    return {
      error: i18n.t('groupsApi.couldNotUpdateUserWithIDToGroupWithID', {
        userID: id,
        groupID: groupID,
      }),
    }
  }
}

const removeUserFromGroup = async (
  id: string,
  groupID: string
): Promise<ApiResponse<null>> => {
  try {
    await callGraphQL<Mutation>(deleteUser, {
      input: {
        id,
      },
    })
    return { result: null }
  } catch (e) {
    return {
      error: i18n.t('groupsApi.couldNotRemoveUserWithIDFromGroupWithID', {
        userID: id,
        groupID: groupID,
      }),
    }
  }
}

const addGroup = async (user: any, orgID: any): Promise<ApiResponse<Group>> => {
  try {
    const groupsGQ = await callGraphQL<Mutation>(createGroup, {
      input: {
        id: uuidv4(),
        groupLeaderUsername: user.Username,
        organizationID: orgID,
        orgGroupLeaders: `${orgID}${GROUPLEADER_COGNITOGROUP_SUFFIX}`,
        orgAdmins: `${orgID}${ADMIN_COGNITOGROUP_SUFFIX}`,
      },
    })
    const group = groupsGQ?.data?.createGroup as Group
    return { result: group || null }
  } catch (e) {
    return { error: i18n.t('groupsApi.couldNotAddAGroup') }
  }
}

const removeGroup = async (group: any): Promise<ApiResponse<null>> => {
  try {
    await callGraphQL<Mutation>(deleteGroup, {
      input: {
        id: group.id,
      },
    })
    return { result: null }
  } catch (e) {
    return {
      error: i18n.t('groupsApi.couldNotRemoveGroupWithID', {
        groupID: group.id,
      }),
    }
  }
}

const updateGroupLeader = async (
  groupToEdit: any,
  newGroupLeader: any
): Promise<ApiResponse<Group>> => {
  try {
    const groupId = groupToEdit.id
    const newGroupLeaderUsername = newGroupLeader.Username

    const groupGQ = await callGraphQL<Mutation>(updateGroup, {
      input: {
        id: groupId,
        groupLeaderUsername: newGroupLeaderUsername,
      },
    })
    const group = groupGQ?.data?.updateGroup as Group
    return { result: group || null }
  } catch (e) {
    return {
      error: i18n.t('groupsApi.couldNotSetGroupLeaderToUsernameOnGroupWithID', {
        username: newGroupLeader.Username,
        groupID: groupToEdit.id,
      }),
    }
  }
}

export {
  getGroupMembers,
  listAllGroups,
  listAllUsers,
  addGroup,
  removeGroup,
  addUserToGroup,
  updateUserGroup,
  removeUserFromGroup,
  updateGroupLeader,
}
