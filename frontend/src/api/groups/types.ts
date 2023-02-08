interface Group {
  id: string
  organizationid: string
  groupleaderusername: string
}

export type GroupInput = Omit<Group, 'id'>

export type GetGroupInput = Pick<Group, 'id'>
export type DeleteGroupInput = Pick<Group, 'id'>
export type UpdateGroupLeaderInput = Pick<Group, 'groupleaderusername'>

interface User {
  id: string
  groupid: string
  organizationid: string
}

export type UserInput = User

export type AddUserInput = Omit<User, 'groupid'>
export type GetUsersInput = Pick<User, 'groupid'>
export type DeleteUserInput = Pick<User, 'id'>
