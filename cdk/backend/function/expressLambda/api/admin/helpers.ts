import { listUsers } from '../cognito/cognitoActions'

export const getUsersInGroup = async (groupId: string) => {
  const groupMembers = await listUsers().then(users =>
    users.data.Users?.filter(
      user =>
        user.Attributes?.find(attribute => attribute.Name === 'custom:groupId')
          ?.Value === groupId
    )
  )
  return groupMembers
}
