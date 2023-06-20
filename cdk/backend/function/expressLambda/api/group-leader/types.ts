export interface GetByUsername {
  username: string
}

export interface GetByUsernameAndOrganizationId extends GetByUsername {
  organizationId: string
}

export interface IUsername {
  username: string
}

export interface IMyGroupId {
  id: string
}
