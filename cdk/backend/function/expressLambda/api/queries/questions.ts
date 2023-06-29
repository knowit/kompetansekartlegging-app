import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { sqlQuery } from '../../utils/sql'

import { v4 as uuidv4 } from 'uuid'
import {
  IQuestion,
  QuestionCategoryId,
  QuestionId,
  QuestionInput,
} from '../../utils/types'

const listQuestions = async () => {
  const query = `SELECT * FROM question ORDER BY category_id, index`

  return await sqlQuery<IQuestion[]>({
    message: '🚀 ~ > All questions',
    query,
    isArray: true,
  })
}

const getQuestion = async ({ id }: QuestionId) => {
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

  return await sqlQuery<IQuestion>({
    message: `🚀 ~ > Question with id: ${id}`,
    query,
    parameters,
  })
}

const getQuestionsInCategory = async ({ category_id }: QuestionCategoryId) => {
  const parameters: SqlParameter[] = [
    {
      name: 'categoryid',
      value: {
        stringValue: category_id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `SELECT * FROM question WHERE category_id = :categoryid ORDER BY index`

  return await sqlQuery<IQuestion[]>({
    message: `🚀 ~ > All questions with categoryid: ${category_id}`,
    query,
    parameters,
    isArray: true,
  })
}

const createQuestion = async ({
  text,
  topic,
  index,
  category_id: categoryid,
  type,
  scale_start: scalestart,
  scale_middle: scalemiddle,
  scale_end: scaleend,
}: QuestionInput) => {
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
      name: 'categoryid',
      value: {
        stringValue: categoryid,
      },
      typeHint: TypeHint.UUID,
    },

    { name: 'index', value: index ? { longValue: index } : { isNull: true } },
    {
      name: 'scalestart',
      value: scalestart ? { stringValue: scalestart } : { isNull: true },
    },
    {
      name: 'scalemiddle',
      value: scalemiddle ? { stringValue: scalemiddle } : { isNull: true },
    },
    {
      name: 'scaleend',
      value: scaleend ? { stringValue: scaleend } : { isNull: true },
    },
    { name: 'text', value: text ? { stringValue: text } : { isNull: true } },
    { name: 'topic', value: { stringValue: topic } },
  ]

  const query = `INSERT INTO "question" (id, category_id, index, scale_start, scale_middle, scale_end, text, topic, type)
    VALUES(:id, :categoryid, :index, :scalestart, :scalemiddle, :scaleend, :text, :topic, '${type}')
    RETURNING *`

  return await sqlQuery<IQuestion>({
    message: `🚀 ~ > Question with id: ${id} was successfully created`,
    query,
    parameters,
  })
}

const updateQuestion = async (
  { id }: QuestionId,
  {
    text,
    topic,
    index,
    category_id: categoryid,
    type,
    scale_start: scalestart,
    scale_middle: scalemiddle,
    scale_end: scaleend,
  }: QuestionInput
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
      name: 'categoryid',
      value: {
        stringValue: categoryid,
      },
      typeHint: TypeHint.UUID,
    },
    { name: 'index', value: index ? { longValue: index } : { isNull: true } },
    {
      name: 'scalestart',
      value: scalestart ? { stringValue: scalestart } : { isNull: true },
    },
    {
      name: 'scalemiddle',
      value: scalemiddle ? { stringValue: scalemiddle } : { isNull: true },
    },
    {
      name: 'scaleend',
      value: scaleend ? { stringValue: scaleend } : { isNull: true },
    },
    { name: 'text', value: text ? { stringValue: text } : { isNull: true } },
    { name: 'topic', value: topic ? { stringValue: topic } : { isNull: true } },
  ]

  const query = `UPDATE "question"
    SET category_id=:categoryid, index=:index, scale_start=:scalestart,
    scale_middle=:scalemiddle, scale_end=:scaleend,
    text=:text, topic=:topic, type='${type}'
    WHERE id=:id
    RETURNING *`

  return await sqlQuery<IQuestion>({
    message: `🚀 ~ > Question with id: ${id} was updated`,
    query,
    parameters,
  })
}

const deleteQuestion = async ({ id }: QuestionId) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: { stringValue: id },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `DELETE FROM "question" WHERE id=:id RETURNING *`

  return await sqlQuery<IQuestion>({
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
