export interface Body {
  username: string
  groupname: string
}

export interface ListQuery {
  token: string
  limit: number
}

export type UserBody = Omit<Body, 'groupname'>
export type ListGroupsForUserQuery = ListQuery & Omit<Body, 'groupname'>
export type ListUsersInGroupQuery = ListQuery & Omit<Body, 'username'>
