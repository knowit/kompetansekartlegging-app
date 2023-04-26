export interface IGroup {
  id: string
  organizationid: string
  groupleaderusername: string
}

export type GroupInput = Omit<IGroup, 'id'>

export type GetGroupInput = Pick<IGroup, 'id'>
export type DeleteGroupInput = Pick<IGroup, 'id'>
export type UpdateGroupLeaderInput = Pick<IGroup, 'groupleaderusername'>

export interface IUser {
  username: string
  groupid: string
  organizationid: string
}

export type UserInput = IUser

export type AddUserInput = Omit<IUser, 'groupid'>
export type GetUsersInput = Pick<IUser, 'groupid'>
export type DeleteUserInput = Pick<IUser, 'username'>
