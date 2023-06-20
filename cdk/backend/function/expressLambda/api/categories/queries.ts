import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'

import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../utils/sql'
import {
  CategoryInput,
  DeleteCategoryInput,
  GetCategoryInput,
  ICategory,
} from './types'

const listCategories = async () => {
  const query = 'SELECT * FROM "category"'
  return await sqlQuery<ICategory[]>({
    message: '🚀 ~ > All categories.',
    query,
    isArray: true,
  })
}

const getCategory = async ({ id }: GetCategoryInput) => {
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

const deleteCategory = async ({ id }: DeleteCategoryInput) => {
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
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}
