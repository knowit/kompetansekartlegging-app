export interface Group {
  id: string
  orgid: string
  groupleaderusername: string
}

export type GroupList = Group[]

export interface User {
  id: string
  groupid: string
  orgid: string
}

export type UserList = User[]
