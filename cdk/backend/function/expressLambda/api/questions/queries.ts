import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { sqlQuery } from '../../app'

import { v4 as uuidv4 } from 'uuid'

export interface CreateQuestionProps {
  categoryId: string
  formDefinitionId: string
  index: number
  organizationId: string
  scaleStart: string | undefined
  scaleMiddle: string | undefined
  scaleEnd: string | undefined
  text: string
  topic: string
  type2: QuestionType
  type: 'customScaleValue' | 'knowledgeMotivation' | 'text'
}

export enum QuestionType {
  customScaleValue = 'customScaleValue',
  knowledgeMotivation = 'knowledgeMotivation',
  text = 'text',
}

const listQuestions = async () => {
  const query = `SELECT * FROM question`

  return await sqlQuery({
    message: '🚀 ~ > All questions',
    query,
  })
}

const getQuestion = async (id: string) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `SELECT * FROM question WHERE id = :id`

  const response = await sqlQuery({
    message: `🚀 ~ > Question with id: ${id}`,
    query,
    parameters,
  })

  return {
    message: `🚀 ~ > Question with id: ${id}`,
    data: response,
  }
}

const getQuestionsInCategory = async (categoryId: string) => {
  const parameters: SqlParameter[] = [
    {
      name: 'categoryId',
      value: {
        stringValue: categoryId,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `SELECT * FROM question WHERE categoryID = :categoryId`

  return await sqlQuery({
    message: `🚀 ~ > All questions with categoryId: ${categoryId}`,
    query,
    parameters,
  })
}

const createQuestion = async ({
  categoryId,
  formDefinitionId,
  index,
  organizationId,
  scaleStart,
  scaleMiddle,
  scaleEnd,
  text,
  topic,
  type,
}: CreateQuestionProps) => {
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
      name: 'categoryId',
      value: {
        stringValue: categoryId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'formDefinitionId',
      value: { stringValue: formDefinitionId },
      typeHint: TypeHint.UUID,
    },
    { name: 'index', value: { longValue: index } },
    { name: 'organizationId', value: { stringValue: organizationId } },
    {
      name: 'scaleStart',
      value: scaleStart ? { stringValue: scaleStart } : { isNull: true },
    },
    {
      name: 'scaleMiddle',
      value: scaleMiddle ? { stringValue: scaleMiddle } : { isNull: true },
    },
    {
      name: 'scaleEnd',
      value: scaleEnd ? { stringValue: scaleEnd } : { isNull: true },
    },
    { name: 'text', value: { stringValue: text } },
    { name: 'topic', value: { stringValue: topic } },
  ]

  const questionType = QuestionType[type]

  const query = `INSERT INTO "question" (id, categoryID, formDefinitionID, index, organizationID, scaleStart, scaleMiddle, scaleEnd, text, topic, type)
    VALUES(:id, :categoryId, :formDefinitionId, :index, :organizationId, :scaleStart, :scaleMiddle, :scaleEnd, :text, :topic, '${questionType}')
    RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > Question with id: ${id} was successfully created`,
    query,
    parameters,
  })
}

const updateQuestion = async (
  id: string,
  {
    categoryId,
    formDefinitionId,
    index,
    organizationId,
    scaleStart,
    scaleMiddle,
    scaleEnd,
    text,
    topic,
    type,
  }: CreateQuestionProps
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
      name: 'categoryId',
      value: {
        stringValue: categoryId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'formDefinitionId',
      value: { stringValue: formDefinitionId },
      typeHint: TypeHint.UUID,
    },
    { name: 'index', value: { longValue: index } },
    { name: 'organizationId', value: { stringValue: organizationId } },
    {
      name: 'scaleStart',
      value: scaleStart ? { stringValue: scaleStart } : { isNull: true },
    },
    {
      name: 'scaleMiddle',
      value: scaleMiddle ? { stringValue: scaleMiddle } : { isNull: true },
    },
    {
      name: 'scaleEnd',
      value: scaleEnd ? { stringValue: scaleEnd } : { isNull: true },
    },
    { name: 'text', value: { stringValue: text } },
    { name: 'topic', value: { stringValue: topic } },
  ]

  const questionType = QuestionType[type]

  const query = `UPDATE "question"
    SET categoryID=:categoryId, formDefinitionID=:formDefinitionId, index=:index,
    organizationID=:organizationId, scaleStart=:scaleStart, scaleMiddle=:scaleMiddle, scaleEnd=:scaleEnd,
    text=:text, topic=:topic, type='${questionType}'
    WHERE id=:id
    RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > Question with id: ${id} was updated`,
    query,
    parameters,
  })
}

const deleteQuestion = async (id: string) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: { stringValue: id },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `DELETE FROM "question" WHERE id=:id RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > Question with id: ${id} was successfully deleted`,
    query,
    parameters,
  })
}

export default {
  listQuestions,
  getQuestion,
  getQuestionsInCategory,
  createQuestion,
  updateQuestion,
  deleteQuestion,
}
