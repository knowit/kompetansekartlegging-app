import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../utils/sql'
import { createTimestampNow } from '../utils'
import {
  DeleteQuestionAnswerInput,
  GetQuestionAnswerByUserAndQuestionInput,
  GetQuestionAnswerInput,
  QuestionAnswer,
  QuestionAnswerInput,
} from './types'

const listQuestionAnswers = async () => {
  const query = 'SELECT id FROM question_answer'

  return await sqlQuery<QuestionAnswer[]>({
    message: '🚀 ~ > All question_answers',
    query,
    isArray: true,
  })
}

const getQuestionAnswer = async ({ id }: GetQuestionAnswerInput) => {
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

  return await sqlQuery<QuestionAnswer>({
    message: `🚀 ~ > Question Answer with id: ${id}`,
    query,
    parameters,
  })
}

const getQuestionAnswerByUserAndQuestion = async ({
  user_username,
  question_id,
}: GetQuestionAnswerByUserAndQuestionInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'user_username',
      value: {
        stringValue: user_username,
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
  const query = `SELECT * FROM question_answer WHERE user_username = :user_username AND question_id = :questionid`

  return await sqlQuery<QuestionAnswer>({
    message: `🚀 ~ > Question Answer with user_username: ${user_username} and question_id: ${question_id}`,
    query,
    parameters,
  })
}

const createQuestionAnswer = async ({
  user_username,
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
      name: 'user_username',
      value: {
        stringValue: user_username,
      },
      typeHint: TypeHint.UUID,
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

  const query = `INSERT INTO question_answer (id, user_username, question_id, knowledge, motivation, custom_scale_value, text_value)
    VALUES(:id, :user_username, :questionid, :knowledge, :motivation, :customscalevalue, :textvalue)
    RETURNING *`

  return await sqlQuery<QuestionAnswer>({
    message: `🚀 ~ > Question Answer with id: ${id} was successfully created`,
    query,
    parameters,
  })
}

const updateQuestionAnswer = async (
  { id }: GetQuestionAnswerInput,
  {
    user_username,
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
      name: 'user_username',
      value: {
        stringValue: user_username,
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

  // TODO: Se kommentar fra @Lekesoldat
  const query = `UPDATE question_answer
        SET user_username=:user_username, question_id=:questionid, knowledge=:knowledge, motivation=:motivation,
        custom_scale_value=:customscalevalue, text_value=:textvalue, updated_at=:updated_at
        WHERE id=:id
        RETURNING *`

  return await sqlQuery<QuestionAnswer>({
    message: `🚀 ~ > questionAnswer with id: ${id} was updated`,
    query,
    parameters,
  })
}

const deleteQuestionAnswer = async ({ id }: DeleteQuestionAnswerInput) => {
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

  return await sqlQuery<QuestionAnswer>({
    message: `🚀 ~ > QuestionAnswer with id: ${id} was deleted`,
    query,
    parameters,
  })
}

const createQuestionAnswerFromBatch = async ({
  user_username,
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
      name: 'user_username',
      value: {
        stringValue: user_username,
      },
      typeHint: TypeHint.UUID,
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

  const query = `INSERT INTO question_answer (id, user_username, question_id knowledge, motivation, custom_scale_value, text_value)
  VALUES(:id, :user_username, :questionid, :knowledge, :motivation, :customscalevalue, :textvalue)
  RETURNING *`

  return await sqlQuery<QuestionAnswer>({
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
