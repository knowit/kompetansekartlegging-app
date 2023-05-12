export interface IGroup {
  id: string
  organization_id: string
  group_leader_username: string
}

export type GroupInput = Omit<IGroup, 'id'>

export type GetGroupInput = Pick<IGroup, 'id'>
export type DeleteGroupInput = Pick<IGroup, 'id'>
export type UpdateGroupLeaderInput = Pick<IGroup, 'group_leader_username'>

export type AddUsersQuery = Pick<IGroup, 'id'>

export interface IUser {
  username: string
  group_id: string
  organization_id: string
}

export type UserInput = IUser

export type AddUserInput = Omit<IUser, 'group_id'>
export type GetUsersInput = Pick<IUser, 'group_id'>
export type DeleteUserInput = Pick<IUser, 'username'>

export type AddUsersBody = Omit<IUser, 'group_id'>[]
