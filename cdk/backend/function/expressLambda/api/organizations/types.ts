export interface Organization {
  id: string
  createdat: string
  owner: string
  orgname: string
  identifierattribute: string
}

export type OrganizationInput = Omit<Organization, 'createdat' | 'owner'>

export type DeleteOrganizationInput = Pick<Organization, 'id'>
