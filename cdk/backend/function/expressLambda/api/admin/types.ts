import { AdminGetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider'
import { User } from '../groups/types'
export interface GetGroupQuery {
  id: string
}

export type UserAnnotated = User | Omit<AdminGetUserResponse, 'Username'>
