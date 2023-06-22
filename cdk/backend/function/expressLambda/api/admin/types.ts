import { AdminGetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider'
import { User } from '../groups/types'
export interface GetGroupQuery {
  id: string
}

export type UserAnnotated =
  | User
  | Omit<AdminGetUserResponse, 'Username' | 'UserAttributes'>
  | { cognitoAttributes: AdminGetUserResponse['UserAttributes'] }

export interface AddUserToGroupBody {
  group_id: string
}

export interface IUsername {
  username: string
}
