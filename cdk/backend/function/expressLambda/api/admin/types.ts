import { AttributeListType } from 'aws-sdk/clients/cognitoidentityserviceprovider'
import { IUser } from '../groups/types'
export interface GetGroupQuery {
  id: string
}

export interface IUserAnnotated extends IUser {
  group_leader_username: string
  cognito_attributes: AttributeListType
}
