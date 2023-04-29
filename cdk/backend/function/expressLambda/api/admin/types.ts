import { AttributeListType } from 'aws-sdk/clients/cognitoidentityserviceprovider'
export interface GetGroupQuery {
  id: string
}

export interface UserAnnotated {
  group_id: string
  username: string
  group_leader_username: string
  cognito_attributes: AttributeListType
}
