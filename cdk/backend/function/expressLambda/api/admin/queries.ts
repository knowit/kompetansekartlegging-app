import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { sqlQuery } from '../../app'

const getOrganizationIdFromIdentifierAttribute = async (identifier: string) => {
  const parameters: SqlParameter[] = [
    {
      name: 'identifier_attribute',
      value: {
        stringValue: identifier,
      },
    },
  ]

  const query =
    'SELECT id FROM organization WHERE identifier_attribute=:identifier_attribute'

  return sqlQuery({
    query,
    parameters,
    message: `🚀 ~ > id for organization with identifier attribute ${identifier}`,
  })
}

const getUsersInOrganization = async (id: string) => {
  const parameters: SqlParameter[] = [
    { name: 'id', value: { stringValue: id }, typeHint: TypeHint.UUID },
  ]

  const query = 'SELECT * FROM "user" WHERE organization_id=:id'

  return sqlQuery({
    query,
    parameters,
    message: `🚀 ~ > All users in organization with id ${id}`,
  })
}

export default {
  getOrganizationIdFromIdentifierAttribute,
  getUsersInOrganization,
}
