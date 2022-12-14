import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../app'
import { createTimestampNow } from '../utils'

const listFormDefinitions = async () => {
  const LIST_QUERY = `SELECT * FROM formDefinition`
  const records = await sqlQuery(LIST_QUERY)

  return {
    message: `🚀 ~ > All Form Definitions:`,
    data: records,
  }
}

interface CreateFormDefinitionInput {
  name: string
  organizationID: string
}

const createFormDefinition = async ({
  name,
  organizationID,
}: CreateFormDefinitionInput) => {
  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: uuidv4(),
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'label',
      value: {
        stringValue: name,
      },
    },
    {
      name: 'organizationID',
      value: {
        stringValue: organizationID,
      },
    },
    {
      name: 'createdAt',
      value: {
        stringValue: createTimestampNow(),
      },
      typeHint: TypeHint.TIMESTAMP,
    },
  ]

  const CREATE_QUERY = `INSERT INTO formDefinition (id, label, createdAt, organizationID) 
        VALUES (:id, :label, :createdAt, :organizationID) 
        RETURNING *`
  const records = await sqlQuery(CREATE_QUERY, params)

  return { message: `🚀 ~ > Form Definition '${name}' created.`, data: records }
}

interface DeleteFormDefinitionInput {
  id: string
}

const deleteFormDefinition = async ({ id }: DeleteFormDefinitionInput) => {
  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const DELETE_QUERY = `DELETE FROM formDefinition WHERE id = :id RETURNING *`
  const records = await sqlQuery(DELETE_QUERY, params)

  return {
    message: `🚀 ~ > Form Definition with id '${id}' deleted.`,
    data: records,
  }
}

export default {
  createFormDefinition,
  deleteFormDefinition,
  listFormDefinitions,
}
