export interface Organization {
  id: string
  created_at: string
  organization_name: string
  identifier_attribute: string
}

export type OrganizationInput = Omit<Organization, 'created_at'>

export type GetOrganizationInput = Pick<Organization, 'id'>
export type GetOrganizationByIdentifierInput = Pick<
  Organization,
  'identifier_attribute'
>
export type DeleteOrganizationInput = Pick<Organization, 'id'>
