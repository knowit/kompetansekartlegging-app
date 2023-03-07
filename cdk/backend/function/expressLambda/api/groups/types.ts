interface Group {
  id: string
  organization_id: string
  group_leader_id: string
}

export type GroupInput = Omit<Group, 'id'>

export type GetGroupInput = Pick<Group, 'id'>
export type DeleteGroupInput = Pick<Group, 'id'>
export type UpdateGroupLeaderInput = Pick<Group, 'group_leader_id'>

interface User {
  id: string
  mail: string
  group_id: string
  organization_id: string
}

export type UserInput = User

export type AddUserInput = Omit<User, 'group_id'>
export type GetUsersInput = Pick<User, 'group_id'>
export type DeleteUserInput = Pick<User, 'id'>
