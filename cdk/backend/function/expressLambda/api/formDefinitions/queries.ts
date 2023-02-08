import { SqlParameter } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../app'
import { createTimestampNow } from '../utils'
import { formDefinitionColumns, kindToParam } from './helpers'
import {
  DeleteFormDefinitionInput,
  FormDefinitionInput,
  GetFormDefinitionInput,
  UpdateFormDefinitionInput,
} from './types'

const listFormDefinitions = async () => {
  const query = `SELECT * FROM formDefinition`

  return await sqlQuery({
    message: `🚀 ~ > All Form Definitions:`,
    query,
  })
}

const createFormDefinition = async ({
  label,
  organizationid,
}: FormDefinitionInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      ...kindToParam(uuidv4(), 'uuid'),
    },
    {
      name: 'label',
      ...kindToParam(label, 'string'),
    },
    {
      name: 'organizationid',
      ...kindToParam(organizationid, 'string'),
    },
    {
      name: 'createdat',
      ...kindToParam(createTimestampNow(), 'timestamp'),
    },
  ]

  const query = `INSERT INTO formDefinition (id, label, createdat, organizationid) 
        VALUES (:id, :label, :createdat, :organizationid) 
        RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > Form Definition '${label}' created.`,
    query,
    parameters,
  })
}

const deleteFormDefinition = async ({ id }: DeleteFormDefinitionInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      ...kindToParam(id, 'uuid'),
    },
  ]

  const query = `DELETE FROM formDefinition WHERE id = :id RETURNING *`
  return await sqlQuery({
    message: `🚀 ~ > Form Definition with id '${id}' deleted.`,
    query,
    parameters,
  })
}

const updateFormDefinition = async (
  { id }: GetFormDefinitionInput,
  values: UpdateFormDefinitionInput
) => {
  if (!values.updatedat) {
    values.updatedat = createTimestampNow()
  }

  // Generate the column string based on provided values
  let columnString = ''
  const lastEntryIndex = Object.keys(values).length - 1

  const parameters: SqlParameter[] = [
    {
      name: 'id',
      ...kindToParam(id, 'uuid'),
    },
  ]

  Object.entries(values).forEach(([field, value], i) => {
    // Check if provided field exists in table definition
    if (!(field in formDefinitionColumns)) {
      throw new Error(`Invalid field: ${field}. Potential SQL injection?`)
    }

    columnString += `${field}=:${field}`
    if (i !== lastEntryIndex) {
      columnString += ', '
    }

    const param: SqlParameter = {
      name: field,
      ...kindToParam(value, formDefinitionColumns[field].kind),
    }

    parameters.push(param)
  })

  const query = `UPDATE formDefinition SET ${columnString} WHERE id=:id RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > formDefinition with id '${id}' is now updated.`,
    query,
    parameters,
  })
}

export default {
  createFormDefinition,
  deleteFormDefinition,
  listFormDefinitions,
  updateFormDefinition,
}
