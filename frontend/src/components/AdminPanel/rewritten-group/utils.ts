import { AttributeType } from '@aws-sdk/client-cognito-identity-provider'
import { IUserAnnotated } from '../../../api/admin/types'

export const getAttribute = (user: IUserAnnotated, attribute: string) =>
  user.cognito_attributes?.find(
    (attr: AttributeType) => attr.Name === attribute
  )?.Value

export const getNameOrUsername = (user: IUserAnnotated) =>
  getAttribute(user, 'name') || user.username

export const containsUser = (
  user: IUserAnnotated,
  members: IUserAnnotated[]
) => {
  return members.some((member) => member.username === user.username)
}
