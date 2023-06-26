export interface GetGroupQuery {
  id: string
}

export interface AddUserToGroupQuery {
  group_id: string
  username: string
}

export interface IUsername {
  username: string
}
