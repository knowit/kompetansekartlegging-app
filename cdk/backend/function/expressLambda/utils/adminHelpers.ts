import { CognitoActions } from '../api/queries'

export const getUsersInGroup = async (groupId: string) => {
  const groupMembers = await CognitoActions.listUsers().then(users =>
    users.data.Users?.filter(
      user =>
        user.Attributes?.find(attribute => attribute.Name === 'custom:groupId')
          ?.Value === groupId
    )
  )
  return groupMembers
}
