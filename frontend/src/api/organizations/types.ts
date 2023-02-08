export interface Organization {
  id: string
  timestamp: string
  owner: string
  orgname: string
  identifierAttribute: string
}

export type OrganizationList = Organization[]
