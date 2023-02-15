import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import {
  DeleteQuestionAnswerInput,
  GetQuestionAnswerInput,
  QuestionAnswer,
  QuestionAnswerInput,
} from './types'

export const getAllQuestionAnswers = async () =>
  apiGET<Pick<QuestionAnswer, 'id'>[]>('/questionAnswers')

export const getQuestionAnswerById = async (id: GetQuestionAnswerInput) =>
  apiGET<QuestionAnswer>('/questionAnswers/:id', {
    queryStringParameters: id,
  })

export const createQuestionAnswer = async (data: QuestionAnswerInput) =>
  apiPOST<QuestionAnswer>('/questionAnswers', {
    body: data,
  })

export const updateQuestionAnswer = async (
  id: GetQuestionAnswerInput,
  data: QuestionAnswerInput
) =>
  apiPATCH<QuestionAnswer>('/questionAnswers/:id', {
    queryStringParameters: id,
    body: data,
  })

export const deleteQuestionAnswer = async (id: DeleteQuestionAnswerInput) =>
  apiDELETE<QuestionAnswer>('/questionAnswers', {
    body: id,
  })

export const batchCreateQuestionAnswer = async (data: QuestionAnswerInput[]) =>
  apiPOST<QuestionAnswerInput[]>('/questionAnswers/batch', {
    body: data,
  })
