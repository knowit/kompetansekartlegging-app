export interface Group {
  id: string
  organization_id: string
  group_leader_username: string
}
export type GetGroupsInOrganizationInput = { organization: string }

export type GroupInput = Omit<Group, 'id'>
export type GetGroupInput = Pick<Group, 'id'>
export type DeleteGroupInput = Pick<Group, 'id'>
export type UpdateGroupLeaderInput = Pick<Group, 'group_leader_username'>

export interface User {
  username: string
  group_id: string
  organization_id: string
}

export type UserInput = User

export type AddUserInput = Omit<User, 'group_id'>
export type GetUsersInput = Pick<User, 'group_id'>
export type DeleteUserInput = Pick<User, 'username'>
