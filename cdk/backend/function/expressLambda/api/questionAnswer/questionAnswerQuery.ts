import {
  BadRequestException,
  SqlParameter,
  TypeHint,
} from "@aws-sdk/client-rds-data"
import { sqlQuery } from "../../app"

export interface CreateQuestionAnswerProp {
  id: string
  userFormId: string
  questionId: string
  knowledge: number
  motivation: number
  customScaleValue: number
  formDefinitionId: string
  orgAdmins: string
  orgGroupLeaders: string
}

const listQuestionAnswers = async () => {
  const query = "SELECT * FROM questionAnswer"
  const response = await sqlQuery(query)

  return {
    message: "🚀 ~ > All questionAnswers",
    data: response,
  }
}

const getQuestionAnswer = async (id: string) => {
  const params: SqlParameter[] = [
    {
      name: "id",
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]
  const query = 'SELECT * FROM "questionAnswer" WHERE id = :id'
  const response = await sqlQuery(query)

  return {
    message: `🚀 ~ > QuestionAnswer with id: ${id}`,
    data: response,
  }
}

const createQuestionAnswer = async ({
  id,
  userFormId,
  questionId,
  knowledge,
  motivation,
  customScaleValue,
  formDefinitionId,
  orgAdmins,
  orgGroupLeaders,
}: CreateQuestionAnswerProp) => {
  const params: SqlParameter[] = [
    {
      name: "id",
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "userFormId",
      value: {
        stringValue: userFormId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "questionId",
      value: {
        stringValue: questionId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "knowledge",
      value: {
        longValue: knowledge,
      },
    },
    {
      name: "motivation",
      value: {
        longValue: motivation,
      },
    },
    {
      name: "customScaleValue",
      value: {
        longValue: customScaleValue,
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
      name: "orgAdmins",
      value: {
        stringValue: orgAdmins,
      },
    },
    {
      name: "orgGroupLeaders",
      value: {
        stringValue: orgGroupLeaders,
      },
    },
  ]

  const query = `INSERT INTO "questionAnswer" (id, userFormID, questionID, knowledge, motivation, customScaleValue, formDefinitionID, orgAdmins, orgGroupLeaders)
    VALUES(:id, :userFormId, :questionId, :knowledge, :motivation, :customScaleValue, :formDefinitionId, :orgAdmins, :orgGroupLeaders)
    RETURNING *`
  const response = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > QuestionAnswer with id: ${id} was successfully created`,
    data: response,
  }
}

const updateQuestionAnswer = async (
  questionAnswerId: string,
  {
    id,
    userFormId,
    questionId,
    knowledge,
    motivation,
    customScaleValue,
    formDefinitionId,
    orgAdmins,
    orgGroupLeaders,
  }: CreateQuestionAnswerProp
) => {
  if (id !== questionAnswerId) {
    throw BadRequestException
  }
  const params: SqlParameter[] = [
    {
      name: "id",
      value: {
        stringValue: questionAnswerId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "userFormId",
      value: {
        stringValue: userFormId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "questionId",
      value: {
        stringValue: questionId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "knowledge",
      value: {
        longValue: knowledge,
      },
    },
    {
      name: "motivation",
      value: {
        longValue: motivation,
      },
    },
    {
      name: "customScaleValue",
      value: {
        longValue: customScaleValue,
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
      name: "orgAdmins",
      value: {
        stringValue: orgAdmins,
      },
    },
    {
      name: "orgGroupLeaders",
      value: {
        stringValue: orgGroupLeaders,
      },
    },
  ]

  const query = `UPDATE "questionAnswer"
        SET userFormID=:userFormId, questionID=:questionId, knowledge=:knowledge, motivation=:motivation,
        customScaleValue=:customScaleValue, formDefinitionID=:formDefinitionId, orgAdmins=:orgAdmins, orgGroupLeaders=:orgGroupLeaders
        WHERE id=:id
        RETURNING *`

  const response = await sqlQuery(query, params)
  return {
    message: `🚀 ~ > questionAnswer with id: ${id} was updated`,
    data: response,
  }
}

const deleteQuestionAnswer = async (id: string) => {
  const params: SqlParameter[] = [
    {
      name: "id",
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `DELETE FROM "questionAnswer" WHERE id=:id RETURNING`
  const response = sqlQuery(query, params)

  return {
    message: `🚀 ~ > QuestionAnswer with id: ${id} was deleted`,
    data: response,
  }
}

const createQuestionAnswerFromBatch = async ({
  id,
  userFormId,
  questionId,
  knowledge,
  motivation,
  customScaleValue,
  formDefinitionId,
  orgAdmins,
  orgGroupLeaders,
}: CreateQuestionAnswerProp) => {
  const params: SqlParameter[] = [
    {
      name: "id",
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "userFormId",
      value: {
        stringValue: userFormId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "questionId",
      value: {
        stringValue: questionId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "knowledge",
      value: {
        longValue: knowledge,
      },
    },
    {
      name: "motivation",
      value: {
        longValue: motivation,
      },
    },
    {
      name: "customScaleValue",
      value: {
        longValue: customScaleValue,
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
      name: "orgAdmins",
      value: {
        stringValue: orgAdmins,
      },
    },
    {
      name: "orgGroupLeaders",
      value: {
        stringValue: orgGroupLeaders,
      },
    },
  ]

  const query = `INSERT INTO "questionAnswer" (id, userFormID, questionID, knowledge, motivation, customScaleValue, formDefinitionID, orgAdmins, orgGroupLeaders)
  VALUES(:id, :userFormId, :questionId, :knowledge, :motivation, :customScaleValue, :formDefinitionId, :orgAdmins, :orgGroupLeaders)
  ON CONFLICT (id)
  DO UPDATE SET userFormID=:userFormId, questionID=:questionId, knowledge=:knowledge, motivation=:motivation,
  customScaleValue=:customScaleValue, formDefinitionID=:formDefinitionId, orgAdmins=:orgAdmins, orgGroupLeaders=:orgGroupLeaders
  WHERE excluded.id=:id
  RETURNING *`

  const response = sqlQuery(query, params)

  return {
    message: `🚀 ~ > QuestionAnswer with id: ${id} has been added or updated`,
    data: response,
  }
}

export default {
  listQuestionAnswers,
  getQuestionAnswer,
  createQuestionAnswer,
  updateQuestionAnswer,
  deleteQuestionAnswer,
  createQuestionAnswerFromBatch,
}
