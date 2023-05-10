import { AttributeType } from '@aws-sdk/client-cognito-identity-provider'
import { IUserAnnotated } from '../../../api/admin/types'

export const getCognitoAttribute = (
  attributes: AttributeType[],
  attribute: string
) => attributes?.find((attr: AttributeType) => attr.Name === attribute)?.Value

export const getNameOrUsername = (user: IUserAnnotated) =>
  getCognitoAttribute(user.cognito_attributes, 'name') || user.username

export const containsUser = (
  user: IUserAnnotated,
  members: IUserAnnotated[]
) => {
  return members.some((member) => member.username === user.username)
}
