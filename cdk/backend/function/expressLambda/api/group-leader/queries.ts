import { SqlParameter } from '@aws-sdk/client-rds-data'
import { sqlQuery } from '../../utils/sql'
import { GetByUsernameAndOrganizationId, IUsername } from '../../utils/types'

const myGroup = async ({ username }: IUsername) => {
  const parameters: SqlParameter[] = [
    {
      name: 'username',
      value: {
        stringValue: username,
      },
    },
  ]

  const query = `
    SELECT id FROM "group" WHERE group_leader_username = :username
  `

  return await sqlQuery<{ id: string }>({
    message: `🚀 ~ > Group members for '${username}'`,
    query,
    parameters,
  })
}

const getQuestionAnswersByActiveCatalogAndUser = async ({
  username,
  identifier_attribute,
}: GetByUsernameAndOrganizationId) => {
  const parameters: SqlParameter[] = [
    {
      name: 'username',
      value: {
        stringValue: username,
      },
    },
    {
      name: 'identifier_attribute',
      value: {
        stringValue: identifier_attribute,
      },
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
        AND o.id = (SELECT id FROM organization WHERE identifier_attribute = :identifier_attribute)
        AND qa.username = :username
  `

  return await sqlQuery({
    message: `🚀 ~ > Question answers for '${username}' in organization ${identifier_attribute}'`,
    query,
    parameters,
  })
}

const getLatestAnswerTimestamp = async ({ username }: IUsername) => {
  const parameters: SqlParameter[] = [
    {
      name: 'username',
      value: {
        stringValue: username,
      },
    },
  ]

  const query = `
    SELECT MAX(qa.updated_at) AS latest_answer_timestamp
    FROM question_answer qa
    WHERE qa.username = :username
  `

  return await sqlQuery({
    message: `🚀 ~ > Latest answer timestamp for '${username}'`,
    query,
    parameters,
  })
}

export default {
  myGroup,
  getQuestionAnswersByActiveCatalogAndUser,
  getLatestAnswerTimestamp,
}
