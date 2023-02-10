import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { sqlQuery } from '../../app'
import { v4 as uuidv4 } from 'uuid'
import {
  DeleteQuestionAnswerInput,
  GetQuestionAnswerInput,
  QuestionAnswerInput,
} from './types'

const listQuestionAnswers = async () => {
  const query = 'SELECT id FROM questionAnswer'

  return await sqlQuery({ message: '🚀 ~ > All questionAnswers', query })
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
  const query = 'SELECT * FROM questionAnswer WHERE id = :id'

  return await sqlQuery({
    message: `🚀 ~ > QuestionAnswer with id: ${id}`,
    query,
    parameters,
  })
}

const createQuestionAnswer = async ({
  userformid,
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
      name: 'userformid',
      value: {
        stringValue: userformid,
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

  const query = `INSERT INTO questionAnswer (id, userformid, questionid, knowledge, motivation, customscalevalue)
    VALUES(:id, :userformid, :questionid, :knowledge, :motivation, :customscalevalue)
    RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > QuestionAnswer with id: ${id} was successfully created`,
    query,
    parameters,
  })
}

const updateQuestionAnswer = async (
  { id }: GetQuestionAnswerInput,
  {
    userformid,
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
      name: 'userformid',
      value: {
        stringValue: userformid,
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
  const query = `UPDATE questionAnswer
        SET userformid=:userformid, questionid=:questionid, knowledge=:knowledge, motivation=:motivation,
        customscalevalue=:customscalevalue, textvalue=:textvalue
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

  const query = `DELETE FROM questionAnswer WHERE id=:id RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > QuestionAnswer with id: ${id} was deleted`,
    query,
    parameters,
  })
}

const createQuestionAnswerFromBatch = async ({
  userformid,
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
      name: 'userformid',
      value: {
        stringValue: userformid,
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

  const query = `INSERT INTO questionAnswer (id, userformid, userformid, knowledge, motivation, customscalevalue, textvalue)
  VALUES(:id, :userformid, :questionid, :knowledge, :motivation, :customscalevalue, :textvalue)
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
