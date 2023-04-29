import {
  AdminGetUserResponse,
  AttributeType,
} from '@aws-sdk/client-cognito-identity-provider'

export interface IAdminGroup {
  leader: AdminGetUserResponse
  members: IUserAnnotated
}

export interface IUserAnnotated {
  group_id: string
  username: string
  group_leader_username: string
  cognito_attributes: AttributeType[]
}
