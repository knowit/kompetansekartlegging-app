import {
  BadRequestException,
  SqlParameter,
  TypeHint,
} from "@aws-sdk/client-rds-data"
import { sqlQuery } from "../../app"

interface CreateCategoryProps {
  id: string
  text: string
  description: string
  index: number
  formDefinitionId: string
  organizationId: string
}

interface UpdateCategoryProps extends CreateCategoryProps {
  categoryId: string
}

const listCategories = async () => {
  const query = 'SELECT * FROM "category"'
  const records = await sqlQuery(query)

  return {
    message: "🚀 ~ > All categories.",
    data: records,
  }
}

const getCategory = async (id: string) => {
  const params: SqlParameter[] = [
    {
      name: "id",
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
  id,
  text,
  description,
  index,
  formDefinitionId,
  organizationId,
}: CreateCategoryProps) => {
  const params: SqlParameter[] = [
    {
      name: "id",
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "text",
      value: {
        stringValue: text,
      },
    },
    {
      name: "description",
      value: {
        stringValue: description,
      },
    },
    {
      name: "index",
      value: {
        longValue: index,
      },
    },
    {
      name: "formDefinitionId",
      value: {
        stringValue: formDefinitionId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "organizationId",
      value: {
        stringValue: organizationId,
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

const updateCategory = async ({
  id,
  categoryId,
  text,
  description,
  index,
  formDefinitionId,
  organizationId,
}: UpdateCategoryProps) => {
  if (id !== categoryId) {
    throw BadRequestException
  }
  const params: SqlParameter[] = [
    {
      name: "id",
      value: {
        stringValue: categoryId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "text",
      value: {
        stringValue: text,
      },
    },
    {
      name: "description",
      value: {
        stringValue: description,
      },
    },
    {
      name: "index",
      value: {
        longValue: index,
      },
    },
    {
      name: "formDefinitionId",
      value: {
        stringValue: formDefinitionId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "organizationId",
      value: {
        stringValue: organizationId,
      },
    },
  ]

  const query = `UPDATE "category"
    SET text=:text, description=:description, index=:index, formDefinitionID=:formDefinitionId, organizationID=:organizationId
    WHERE id=:id
    RETURNING *`
  const response = await sqlQuery(query, params)
  return {
    message: `🚀 ~ > Category with id ${categoryId} was updated`,
    data: response,
  }
}

const deleteCategory = async (id: string) => {
  const params: SqlParameter[] = [
    {
      name: "id",
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
  }
}

export default {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}
