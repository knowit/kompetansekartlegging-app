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
  const records = await sqlQuery(query)

  return {
    message: '🚀 ~ > All categories.',
    data: records,
  }
}

const getCategory = async (id: string) => {
  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = 'SELECT * FROM "category" WHERE id = :id'
  const records = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > Category with id ${id}`,
    data: records,
  }
}

const createCategory = async ({
  text,
  description,
  index,
  formdefinitionid,
  organizationid,
}: CategoryProps) => {
  const id = uuidv4()

  const params: SqlParameter[] = [
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
  const response = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > Category with id ${id} was successfully created`,
    data: response,
  }
}

const updateCategory = async (
  id: string,
  { text, description, index, formdefinitionid, organizationid }: CategoryProps
) => {
  const params: SqlParameter[] = [
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
  const response = await sqlQuery(query, params)
  return {
    message: `🚀 ~ > Category with id ${id} was updated`,
    data: response,
  }
}

const deleteCategory = async (id: string) => {
  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `DELETE FROM "category" WHERE id=:id RETURNING *`
  const response = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > Category with id ${id} was deleted`,
    data: response,
  }
}

export default {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}
