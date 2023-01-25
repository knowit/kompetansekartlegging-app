import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { sqlQuery } from '../../app'
import { v4 as uuidv4 } from 'uuid'

export interface CreateQuestionAnswerProp {
  userFormId: string
  questionId: string
  knowledge: number
  motivation: number
  customScaleValue?: number
  textValue?: string
}

const listQuestionAnswers = async () => {
  const query = 'SELECT id FROM questionAnswer'
  const response = await sqlQuery(query)

  return {
    message: '🚀 ~ > All questionAnswers',
    data: response,
  }
}

const getQuestionAnswer = async (id: string) => {
  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]
  const query = 'SELECT * FROM questionAnswer WHERE id = :id'
  const response = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > QuestionAnswer with id: ${id}`,
    data: response,
  }
}

const createQuestionAnswer = async ({
  userFormId,
  questionId,
  knowledge,
  motivation,
  customScaleValue,
  textValue,
}: CreateQuestionAnswerProp) => {
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
      name: 'userFormId',
      value: {
        stringValue: userFormId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'questionId',
      value: {
        stringValue: questionId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'knowledge',
      value: {
        longValue: knowledge,
      },
    },
    {
      name: 'motivation',
      value: {
        longValue: motivation,
      },
    },
    {
      name: 'customScaleValue',
      value: customScaleValue
        ? {
            longValue: customScaleValue,
          }
        : { isNull: true },
    },
    {
      name: 'textValue',
      value: textValue ? { stringValue: textValue } : { isNull: true },
    },
  ]

  const query = `INSERT INTO questionAnswer (id, userFormID, questionID, knowledge, motivation, customScaleValue)
    VALUES(:id, :userFormId, :questionId, :knowledge, :motivation, :customScaleValue)
    RETURNING *`
  const response = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > QuestionAnswer with id: ${id} was successfully created`,
    data: response,
  }
}

const updateQuestionAnswer = async (
  id: string,
  {
    userFormId,
    questionId,
    knowledge,
    motivation,
    customScaleValue,
    textValue,
  }: CreateQuestionAnswerProp
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
      name: 'userFormId',
      value: {
        stringValue: userFormId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'questionId',
      value: {
        stringValue: questionId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'knowledge',
      value: {
        longValue: knowledge,
      },
    },
    {
      name: 'motivation',
      value: {
        longValue: motivation,
      },
    },
    {
      name: 'customScaleValue',
      value: customScaleValue
        ? {
            longValue: customScaleValue,
          }
        : { isNull: true },
    },
    {
      name: 'textValue',
      value: textValue ? { stringValue: textValue } : { isNull: true },
    },
  ]

  // TODO: Se kommentar fra @Lekesoldat
  const query = `UPDATE questionAnswer
        SET userFormID=:userFormId, questionID=:questionId, knowledge=:knowledge, motivation=:motivation,
        customScaleValue=:customScaleValue, textValue=:textValue
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
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `DELETE FROM questionAnswer WHERE id=:id RETURNING *`
  const response = sqlQuery(query, params)

  return {
    message: `🚀 ~ > QuestionAnswer with id: ${id} was deleted`,
    data: response,
  }
}

const createQuestionAnswerFromBatch = async ({
  userFormId,
  questionId,
  knowledge,
  motivation,
  customScaleValue,
  textValue,
}: CreateQuestionAnswerProp) => {
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
      name: 'userFormId',
      value: {
        stringValue: userFormId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'questionId',
      value: {
        stringValue: questionId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'knowledge',
      value: {
        longValue: knowledge,
      },
    },
    {
      name: 'motivation',
      value: {
        longValue: motivation,
      },
    },
    {
      name: 'customScaleValue',
      value: customScaleValue
        ? {
            longValue: customScaleValue,
          }
        : { isNull: true },
    },
    {
      name: 'textValue',
      value: textValue ? { stringValue: textValue } : { isNull: true },
    },
  ]

  const query = `INSERT INTO questionAnswer (id, userFormID, questionID, knowledge, motivation, customScaleValue, textValue)
  VALUES(:id, :userFormId, :questionId, :knowledge, :motivation, :customScaleValue, :textValue)
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
