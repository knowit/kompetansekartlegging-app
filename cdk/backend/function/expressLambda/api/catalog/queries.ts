import { SqlParameter } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../utils/sql'
import {
  CatalogId,
  CatalogInput,
  ICatalog,
  OrganizationIdentifierAttribute,
  UpdateCatalogInput,
} from '../../utils/types'
import { createTimestampNow } from '../utils'
import { catalogColumns, kindToParam } from './helpers'

const listCatalogs = async () => {
  const query = `SELECT * FROM "catalog"`

  return await sqlQuery<ICatalog[]>({
    message: `🚀 ~ > All Catalogs:`,
    query,
    isArray: true,
  })
}

const listCatalgosInOrganization = async ({
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

  const query = `SELECT * FROM "catalog" WHERE organization_id = (SELECT id FROM organization WHERE identifier_attribute = :identifier_attribute)`

  return await sqlQuery<ICatalog[]>({
    message: `🚀 ~ > All Catalogs in organization: ${identifier_attribute}`,
    query,
    parameters,
    isArray: true,
  })
}

const findActiveCatalogByOrganization = async ({
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
    'SELECT * FROM catalog c WHERE c.id = (SELECT o.active_catalog_id FROM organization o WHERE o.identifier_attribute =:identifier_attribute)'

  return await sqlQuery({
    message: `🚀 ~ > Active catalog of organization with identifier: ${identifier_attribute}`,
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

  return await sqlQuery<ICatalog>({
    message: `🚀 ~ > Catalog '${label}' created.`,
    query,
    parameters,
  })
}

const deleteCatalog = async ({ id }: CatalogId) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      ...kindToParam(id, 'uuid'),
    },
  ]

  const query = `DELETE FROM Catalog WHERE id = :id RETURNING *`
  return await sqlQuery<ICatalog>({
    message: `🚀 ~ > Catalog with id '${id}' deleted.`,
    query,
    parameters,
  })
}

const updateCatalog = async ({ id }: CatalogId, values: UpdateCatalogInput) => {
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

  return await sqlQuery<ICatalog>({
    message: `🚀 ~ > Catalog with id '${id}' is now updated.`,
    query,
    parameters,
  })
}

export default {
  createCatalog,
  deleteCatalog,
  listCatalogs,
  listCatalgosInOrganization,
  updateCatalog,
  findActiveCatalogByOrganization,
}
