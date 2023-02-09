export interface Organization {
  id: string
  createdat: string
  owner: string | null
  orgname: string
  identifierattribute: string
}

export type OrganizationInput = Omit<Organization, 'createdat' | 'owner'>

export type DeleteOrganizationInput = Pick<Organization, 'id'>
