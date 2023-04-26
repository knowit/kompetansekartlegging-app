import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { sqlQuery } from '../../app'
import { GetByUsername, GetByUsernameAndOrganizationId } from './types'

const myGroupMembers = async ({ username }: GetByUsername) => {
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

const getQuestionAnswersByActiveCatalogAndUser = async ({
  username,
  organizationId,
}: GetByUsernameAndOrganizationId) => {
  const parameters: SqlParameter[] = [
    {
      name: 'username',
      value: {
        stringValue: username,
      },
    },
    {
      name: 'organizationId',
      value: {
        stringValue: organizationId,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `
    SELECT qa.*
    FROM catalog c
        JOIN category cat ON c.id = cat.catalog_id
        JOIN question q ON cat.id = q.category_id
        JOIN question_answer qa ON q.id = qa.question_id
        JOIN organization o ON o.id = c.organization_id
    WHERE c.active = TRUE
        AND o.id = :organizationId
        AND qa.user_username = :username
  `

  return await sqlQuery({
    message: `🚀 ~ > Question answers for '${username}' in organization with id '${organizationId}'`,
    query,
    parameters,
  })
}

export default { myGroupMembers, getQuestionAnswersByActiveCatalogAndUser }
