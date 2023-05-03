import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../app'
import { createTimestampNow } from '../utils'
import { catalogColumns, kindToParam } from './helpers'
import {
  DeleteCatalogInput,
  CatalogInput,
  GetCatalogInput,
  UpdateCatalogInput,
} from './types'
import { GetOrganizationInput } from '../organizations/types'

const listCatalogs = async () => {
  const query = `SELECT * FROM "catalog"`

  return await sqlQuery({
    message: `🚀 ~ > All Catalogs:`,
    query,
  })
}

const findActiveCatalogByOrganization = async ({
  id,
}: GetOrganizationInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]
  const query = 'SELECT * FROM organization o RIGHT JOIN catalog c ON o.active_catalog_id = c.id WHERE o.id = :id'
  return await sqlQuery({
    message: `🚀 ~ > Active catalog of organization with id ${id}`,
    query,
    parameters,
  })
}

const createCatalog = async ({ label, organization_id }: CatalogInput) => {
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
      name: 'organization_id',
      ...kindToParam(organization_id, 'uuid'),
    },
    {
      name: 'created_at',
      ...kindToParam(createTimestampNow(), 'timestamp'),
    },
  ]

  const query = `INSERT INTO "catalog" (id, label, created_at, organization_id) 
        VALUES (:id, :label, :created_at, :organization_id) 
        RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > Catalog '${label}' created.`,
    query,
    parameters,
  })
}

const deleteCatalog = async ({ id }: DeleteCatalogInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      ...kindToParam(id, 'uuid'),
    },
  ]

  const query = `DELETE FROM Catalog WHERE id = :id RETURNING *`
  return await sqlQuery({
    message: `🚀 ~ > Catalog with id '${id}' deleted.`,
    query,
    parameters,
  })
}

const updateCatalog = async (
  { id }: GetCatalogInput,
  values: UpdateCatalogInput
) => {
  if (!values.updated_at) {
    values.updated_at = createTimestampNow()
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
    if (!(field in catalogColumns)) {
      throw new Error(`Invalid field: ${field}. Potential SQL injection?`)
    }

    columnString += `${field}=:${field}`
    if (i !== lastEntryIndex) {
      columnString += ', '
    }

    const param: SqlParameter = {
      name: field,
      ...kindToParam(value, catalogColumns[field].kind),
    }

    parameters.push(param)
  })

  const query = `UPDATE "catalog" SET ${columnString} WHERE id=:id RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > Catalog with id '${id}' is now updated.`,
    query,
    parameters,
  })
}

export default {
  createCatalog,
  deleteCatalog,
  listCatalogs,
  updateCatalog,
  findActiveCatalogByOrganization,
}
