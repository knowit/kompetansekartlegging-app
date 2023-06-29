import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'

import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../utils/sql'
import {
  CategoryCatalogId,
  CategoryId,
  CategoryInput,
  ICategory,
} from '../../utils/types'

const listCategoriesInOrganization = async (
  org_identifier_attribute: string
) => {
  const parameters: SqlParameter[] = [
    {
      name: 'identifier_attribute',
      value: {
        stringValue: org_identifier_attribute,
      },
    },
  ]

  const query =
    'SELECT * FROM category WHERE catalog_id = (SELECT id FROM "catalog" WHERE active = TRUE AND organization_id = (SELECT id FROM organization WHERE identifier_attribute = :identifier_attribute)) ORDER BY catalog_id, index'

  return await sqlQuery<ICategory[]>({
    message: `🚀 ~ > All categories in organization ${org_identifier_attribute}`,
    parameters,
    query,
    isArray: true,
  })
}

const getCategory = async ({ id }: CategoryId) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = 'SELECT * FROM "category" WHERE id = :id'

  return await sqlQuery<ICategory>({
    message: `🚀 ~ > Category with id ${id}`,
    query,
    parameters,
  })
}

const getCategoryInCatalog = async ({ catalog_id }: CategoryCatalogId) => {
  const parameters: SqlParameter[] = [
    {
      name: 'catalog_id',
      value: {
        stringValue: catalog_id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query =
    'SELECT * FROM "category" WHERE catalog_id = :catalog_id ORDER BY catalog_id, index'

  return await sqlQuery<ICategory[]>({
    message: `🚀 ~ > Categories in catalog with id ${catalog_id}`,
    query,
    parameters,
    isArray: true,
  })
}

const createCategory = async ({
  text,
  description,
  index,
  catalog_id,
}: CategoryInput) => {
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
      name: 'text',
      value: {
        stringValue: text,
      },
    },
    {
      name: 'description',
      value: description
        ? {
            stringValue: description,
          }
        : { isNull: true },
    },
    {
      name: 'index',
      value: index
        ? {
            longValue: index,
          }
        : { isNull: true },
    },
    {
      name: 'catalog_id',
      value: {
        stringValue: catalog_id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `INSERT INTO "category" (id, text, description, index, catalog_id)
     VALUES(:id, :text, :description, :index, :catalog_id)
     RETURNING *`

  return await sqlQuery<ICategory>({
    message: `🚀 ~ > Category with id ${id} was successfully created`,
    query,
    parameters,
  })
}

const updateCategory = async (
  id: string,
  { text, description, index, catalog_id }: CategoryInput
) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'text',
      value: {
        stringValue: text,
      },
    },
    {
      name: 'description',
      value: description
        ? {
            stringValue: description,
          }
        : { isNull: true },
    },
    {
      name: 'index',
      value: index
        ? {
            longValue: index,
          }
        : { isNull: true },
    },
    {
      name: 'catalog_id',
      value: {
        stringValue: catalog_id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `UPDATE "category"
    SET text=:text, description=:description, index=:index, catalog_id=:catalog_id
    WHERE id=:id
    RETURNING *`

  return await sqlQuery<ICategory>({
    message: `🚀 ~ > Category with id ${id} was updated`,
    query,
    parameters,
  })
}

const deleteCategory = async ({ id }: CategoryId) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `DELETE FROM "category" WHERE id=:id RETURNING *`

  return await sqlQuery<ICategory>({
    message: `🚀 ~ > Category with id ${id} was deleted`,
    query,
    parameters,
  })
}

export default {
  listCategoriesInOrganization,
  getCategory,
  getCategoryInCatalog,
  createCategory,
  updateCategory,
  deleteCategory,
}
