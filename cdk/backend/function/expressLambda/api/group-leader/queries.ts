import { SqlParameter } from '@aws-sdk/client-rds-data'
import { sqlQuery } from '../../app'

const myGroupMembers = async ({ username }: { username: string }) => {
  const parameters: SqlParameter[] = [
    {
      name: 'username',
      value: {
        stringValue: username,
      },
    },
  ]

  const query = `
    SELECT group_id, username, group_leader_username 
    FROM "user" u
    JOIN "group" g ON u.group_id = g.id
    WHERE g.group_leader_username = :username
  `

  return await sqlQuery({
    message: `🚀 ~ > Group members for '${username}'`,
    query,
    parameters,
  })
}

export default { myGroupMembers }
