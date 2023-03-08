export interface Organization {
  id: string
  created_at: string
  orgname: string
  identifier_attribute: string
}

export type OrganizationInput = Omit<Organization, 'created_at' | 'owner'>

export type DeleteOrganizationInput = Pick<Organization, 'id'>
