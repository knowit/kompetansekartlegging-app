export interface Organization {
  id: string
  created_at: string
  owner: string | null
  orgname: string
  identifier_attribute: string
}

export type OrganizationInput = Omit<Organization, 'created_at' | 'owner'>

export type GetOrganizationInput = Pick<Organization, 'id'>
export type DeleteOrganizationInput = Pick<Organization, 'id'>
