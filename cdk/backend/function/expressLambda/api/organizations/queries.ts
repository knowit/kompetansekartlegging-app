import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../utils/sql'
import {
  IOrganization,
  OrganizationId,
  OrganizationIdentifierAttribute,
  OrganizationInput,
} from '../../utils/types'
import { createTimestampNow } from '../utils'

const listOrganizations = async () => {
  const query = 'SELECT * FROM organization'

  return await sqlQuery<IOrganization[]>({
    message: '🚀 ~ > All organizations.',
    query,
    isArray: true,
  })
}

const getOrganization = async ({ id }: OrganizationId) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = 'SELECT * FROM organization WHERE id = :id'

  return await sqlQuery<IOrganization>({
    message: `🚀 ~ > Organization with id ${id}`,
    query,
    parameters,
  })
}

const getOrganizationByIdentifier = async ({
  identifier_attribute,
}: OrganizationIdentifierAttribute) => {
  const parameters: SqlParameter[] = [
    {
      name: 'identifier_attribute',
      value: {
        stringValue: identifier_attribute,
      },
    },
  ]

  const query =
    'SELECT * FROM organization WHERE identifier_attribute = :identifier_attribute'

  return await sqlQuery<IOrganization>({
    message: `🚀 ~ > Organization ${identifier_attribute}`,
    query,
    parameters,
  })
}

const createOrganization = async ({
  organization_name,
  identifier_attribute,
}: OrganizationInput) => {
  const id = uuidv4()

  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'createdat',
      value: {
        stringValue: createTimestampNow(),
      },
      typeHint: TypeHint.TIMESTAMP,
    },
    {
      name: 'orgname',
      value: {
        stringValue: organization_name,
      },
    },
    {
      name: 'identifierattribute',
      value: {
        stringValue: identifier_attribute,
      },
    },
  ]

  const query = `INSERT INTO organization (id, created_at, organization_name, identifier_attribute) 
  VALUES (:id, to_timestamp(:createdat, 'YYYY-MM-DD HH24:MI:SS'), :orgname, :identifierattribute)
  RETURNING *`

  return await sqlQuery<IOrganization>({
    message: `🚀 ~ > Organization '${organization_name}' with the id '${id}' inserted.`,
    query,
    parameters,
  })
}

const deleteOrganization = async ({
  identifier_attribute,
}: OrganizationIdentifierAttribute) => {
  const parameters: SqlParameter[] = [
    {
      name: 'identifier_attribute',
      value: {
        stringValue: identifier_attribute,
      },
    },
  ]

  const query =
    'DELETE FROM organization WHERE identifier_attribute=:identifier_attribute RETURNING *;'

  return await sqlQuery<IOrganization>({
    message: `🚀 ~ > Organization '${identifier_attribute}' is now deleted.`,
    query,
    parameters,
  })
}

export default {
  listOrganizations,
  getOrganization,
  createOrganization,
  deleteOrganization,
  getOrganizationByIdentifier,
}
