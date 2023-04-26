export interface GetByUsername {
  username: string
}

export interface GetByUsernameAndOrganizationId extends GetByUsername {
  organizationId: string
}
