import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../app'
import {
  DeleteQuestionAnswerInput,
  GetQuestionAnswerInput,
  QuestionAnswerInput,
} from './types'

const listQuestionAnswers = async () => {
  const query = 'SELECT id FROM question_answer'

  return await sqlQuery({ message: '🚀 ~ > All question_answers', query })
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

  return await sqlQuery({
    message: `🚀 ~ > Question Answer with id: ${id}`,
    query,
    parameters,
  })
}

const createQuestionAnswer = async ({
  userid,
  questionid,
  knowledge,
  motivation,
  customscalevalue,
  textvalue,
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
      name: 'userid',
      value: {
        stringValue: userid,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'questionid',
      value: {
        stringValue: questionid,
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
      value: customscalevalue
        ? {
            longValue: customscalevalue,
          }
        : { isNull: true },
    },
    {
      name: 'textvalue',
      value: textvalue ? { stringValue: textvalue } : { isNull: true },
    },
  ]

  const query = `INSERT INTO question_answer (id, user_id, question_id, knowledge, motivation, custom_scale_value, text_value)
    VALUES(:id, :userid, :questionid, :knowledge, :motivation, :customscalevalue, :textvalue)
    RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > Question Answer with id: ${id} was successfully created`,
    query,
    parameters,
  })
}

const updateQuestionAnswer = async (
  { id }: GetQuestionAnswerInput,
  {
    userid,
    questionid,
    knowledge,
    motivation,
    customscalevalue,
    textvalue,
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
      name: 'userid',
      value: {
        stringValue: userid,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'questionid',
      value: {
        stringValue: questionid,
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
      value: customscalevalue
        ? {
            longValue: customscalevalue,
          }
        : { isNull: true },
    },
    {
      name: 'textvalue',
      value: textvalue ? { stringValue: textvalue } : { isNull: true },
    },
  ]

  // TODO: Se kommentar fra @Lekesoldat
  const query = `UPDATE question_answer
        SET user_id=:userid, question_id=:questionid, knowledge=:knowledge, motivation=:motivation,
        custom_scale_value=:customscalevalue, text_value=:textvalue
        WHERE id=:id
        RETURNING *`

  return await sqlQuery({
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

  return await sqlQuery({
    message: `🚀 ~ > QuestionAnswer with id: ${id} was deleted`,
    query,
    parameters,
  })
}

const createQuestionAnswerFromBatch = async ({
  userid,
  questionid,
  knowledge,
  motivation,
  customscalevalue,
  textvalue,
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
      name: 'userid',
      value: {
        stringValue: userid,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'questionid',
      value: {
        stringValue: questionid,
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
      value: customscalevalue
        ? {
            longValue: customscalevalue,
          }
        : { isNull: true },
    },
    {
      name: 'textvalue',
      value: textvalue ? { stringValue: textvalue } : { isNull: true },
    },
  ]

  const query = `INSERT INTO question_answer (id, user_id, question_id knowledge, motivation, custom_scale_value, text_value)
  VALUES(:id, :userid, :questionid, :knowledge, :motivation, :customscalevalue, :textvalue)
  RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > QuestionAnswer with id: ${id} has been added or updated`,
    query,
    parameters,
  })
}

export default {
  listQuestionAnswers,
  getQuestionAnswer,
  createQuestionAnswer,
  updateQuestionAnswer,
  deleteQuestionAnswer,
  createQuestionAnswerFromBatch,
}
