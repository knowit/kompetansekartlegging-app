import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../utils/sql'
import {
  GetQuestionAnswerByUserAndQuestionInput,
  IQuestionAnswer,
  QuestionAnswerId,
  QuestionAnswerInput,
} from '../../utils/types'
import { createTimestampNow } from '../utils'

const listQuestionAnswers = async () => {
  const query = 'SELECT id FROM question_answer'

  return await sqlQuery<IQuestionAnswer[]>({
    message: '🚀 ~ > All question_answers',
    query,
    isArray: true,
  })
}

const getQuestionAnswer = async ({ id }: QuestionAnswerId) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]
  const query = 'SELECT * FROM question_answer WHERE id = :id'

  return await sqlQuery<IQuestionAnswer>({
    message: `🚀 ~ > Question Answer with id: ${id}`,
    query,
    parameters,
  })
}

const getQuestionAnswerByUserAndQuestion = async ({
  username,
  question_id,
}: GetQuestionAnswerByUserAndQuestionInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'username',
      value: {
        stringValue: username,
      },
    },
    {
      name: 'questionid',
      value: {
        stringValue: question_id,
      },
      typeHint: TypeHint.UUID,
    },
  ]
  console.log('🚀 ~ parameters:', parameters)
  const query = `SELECT * FROM question_answer WHERE username = :username AND question_id = :questionid`

  return await sqlQuery<IQuestionAnswer>({
    message: `🚀 ~ > Question Answer with username: ${username} and question_id: ${question_id}`,
    query,
    parameters,
  })
}

const createQuestionAnswer = async ({
  username,
  question_id,
  knowledge,
  motivation,
  custom_scale_value,
  text_value,
}: QuestionAnswerInput) => {
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
      name: 'username',
      value: {
        stringValue: username,
      },
    },
    {
      name: 'questionid',
      value: {
        stringValue: question_id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'knowledge',
      value: knowledge
        ? {
            longValue: knowledge,
          }
        : { isNull: true },
    },
    {
      name: 'motivation',
      value: motivation
        ? {
            longValue: motivation,
          }
        : { isNull: true },
    },
    {
      name: 'customscalevalue',
      value: custom_scale_value
        ? {
            longValue: custom_scale_value,
          }
        : { isNull: true },
    },
    {
      name: 'textvalue',
      value: text_value ? { stringValue: text_value } : { isNull: true },
    },
  ]

  const query = `INSERT INTO question_answer (id, username, question_id, knowledge, motivation, custom_scale_value, text_value)
    VALUES(:id, :username, :questionid, :knowledge, :motivation, :customscalevalue, :textvalue)
    RETURNING *`

  return await sqlQuery<IQuestionAnswer>({
    message: `🚀 ~ > Question Answer with id: ${id} was successfully created`,
    query,
    parameters,
  })
}

const updateQuestionAnswer = async (
  { id }: QuestionAnswerId,
  {
    username,
    question_id,
    knowledge,
    motivation,
    custom_scale_value,
    text_value,
  }: QuestionAnswerInput
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
      name: 'updated_at',
      value: {
        stringValue: createTimestampNow(),
      },
      typeHint: TypeHint.TIMESTAMP,
    },
    {
      name: 'username',
      value: {
        stringValue: username,
      },
    },
    {
      name: 'questionid',
      value: {
        stringValue: question_id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'knowledge',
      value: knowledge
        ? {
            longValue: knowledge,
          }
        : { isNull: true },
    },
    {
      name: 'motivation',
      value: motivation
        ? {
            longValue: motivation,
          }
        : { isNull: true },
    },
    {
      name: 'customscalevalue',
      value: custom_scale_value
        ? {
            longValue: custom_scale_value,
          }
        : { isNull: true },
    },
    {
      name: 'textvalue',
      value: text_value ? { stringValue: text_value } : { isNull: true },
    },
  ]

  const query = `UPDATE question_answer
        SET username=:username, question_id=:questionid, knowledge=:knowledge, motivation=:motivation,
        custom_scale_value=:customscalevalue, text_value=:textvalue, updated_at=:updated_at
        WHERE id=:id
        RETURNING *`

  return await sqlQuery<IQuestionAnswer>({
    message: `🚀 ~ > questionAnswer with id: ${id} was updated`,
    query,
    parameters,
  })
}

const deleteQuestionAnswer = async ({ id }: QuestionAnswerId) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `DELETE FROM question_answer WHERE id=:id RETURNING *`

  return await sqlQuery<IQuestionAnswer>({
    message: `🚀 ~ > QuestionAnswer with id: ${id} was deleted`,
    query,
    parameters,
  })
}

const createQuestionAnswerFromBatch = async ({
  username,
  question_id,
  knowledge,
  motivation,
  custom_scale_value,
  text_value,
}: QuestionAnswerInput) => {
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
      name: 'username',
      value: {
        stringValue: username,
      },
    },
    {
      name: 'questionid',
      value: {
        stringValue: question_id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'knowledge',
      value: knowledge
        ? {
            longValue: knowledge,
          }
        : { isNull: true },
    },
    {
      name: 'motivation',
      value: motivation
        ? {
            longValue: motivation,
          }
        : { isNull: true },
    },
    {
      name: 'customscalevalue',
      value: custom_scale_value
        ? {
            longValue: custom_scale_value,
          }
        : { isNull: true },
    },
    {
      name: 'textvalue',
      value: text_value ? { stringValue: text_value } : { isNull: true },
    },
  ]

  const query = `INSERT INTO question_answer (id, username, question_id knowledge, motivation, custom_scale_value, text_value)
  VALUES(:id, :username, :questionid, :knowledge, :motivation, :customscalevalue, :textvalue)
  RETURNING *`

  return await sqlQuery<IQuestionAnswer>({
    message: `🚀 ~ > QuestionAnswer with id: ${id} has been added or updated`,
    query,
    parameters,
  })
}

export default {
  listQuestionAnswers,
  getQuestionAnswer,
  getQuestionAnswerByUserAndQuestion,
  createQuestionAnswer,
  updateQuestionAnswer,
  deleteQuestionAnswer,
  createQuestionAnswerFromBatch,
}
