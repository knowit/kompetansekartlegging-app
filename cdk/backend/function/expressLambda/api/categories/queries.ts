import {
  BadRequestException,
  SqlParameter,
  TypeHint,
} from '@aws-sdk/client-rds-data'

import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../app'

interface CategoryProps {
  text: string
  description: string
  index: number
  formdefinitionid: string
  organizationid: string
}

const listCategories = async () => {
  const query = 'SELECT * FROM "category"'
  return await sqlQuery({ message: '🚀 ~ > All categories.', query })
}

const getCategory = async (id: string) => {
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

  return await sqlQuery({
    message: `🚀 ~ > Category with id ${id}`,
    query,
    parameters,
  })
}

const createCategory = async ({
  text,
  description,
  index,
  formdefinitionid,
  organizationid,
}: CategoryProps) => {
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
      value: {
        stringValue: description,
      },
    },
    {
      name: 'index',
      value: {
        longValue: index,
      },
    },
    {
      name: 'formDefinitionId',
      value: {
        stringValue: formdefinitionid,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'organizationId',
      value: {
        stringValue: organizationid,
      },
    },
  ]

  const query = `INSERT INTO "category" (id, text, description, index, formDefinitionID, organizationID)
     VALUES(:id, :text, :description, :index, :formDefinitionId, :organizationId)
     RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > Category with id ${id} was successfully created`,
    query,
    parameters,
  })
}

const updateCategory = async (
  id: string,
  { text, description, index, formdefinitionid, organizationid }: CategoryProps
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
      value: {
        stringValue: description,
      },
    },
    {
      name: 'index',
      value: {
        longValue: index,
      },
    },
    {
      name: 'formDefinitionId',
      value: {
        stringValue: formdefinitionid,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'organizationId',
      value: {
        stringValue: organizationid,
      },
    },
  ]

  const query = `UPDATE "category"
    SET text=:text, description=:description, index=:index, formDefinitionID=:formDefinitionId, organizationID=:organizationId
    WHERE id=:id
    RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > Category with id ${id} was updated`,
    query,
    parameters,
  })
}

const deleteCategory = async (id: string) => {
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

  return await sqlQuery({
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
