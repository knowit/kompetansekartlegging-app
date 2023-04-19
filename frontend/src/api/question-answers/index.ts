import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import {
  DeleteQuestionAnswerInput,
  GetQuestionAnswerInput,
  QuestionAnswer,
  QuestionAnswerInput,
} from './types'

const URL = '/question-answers'

export const getAllQuestionAnswers = async () => apiGET<QuestionAnswer[]>(URL)

export const getQuestionAnswerById = async (id: GetQuestionAnswerInput) =>
  apiGET<QuestionAnswer>(`${URL}/:id`, {
    queryStringParameters: id,
  })

export const createQuestionAnswer = async (data: QuestionAnswerInput) =>
  apiPOST<QuestionAnswer>(`${URL}`, {
    body: data,
  })

export const updateQuestionAnswer = async (
  id: GetQuestionAnswerInput,
  data: QuestionAnswerInput
) =>
  apiPATCH<QuestionAnswer>(`${URL}/:id`, {
    queryStringParameters: id,
    body: data,
  })

export const deleteQuestionAnswer = async (id: DeleteQuestionAnswerInput) =>
  apiDELETE<QuestionAnswer>(`${URL}`, {
    body: id,
  })

export const batchCreateQuestionAnswer = async (data: QuestionAnswerInput[]) =>
  apiPOST<QuestionAnswerInput[]>(`${URL}/batch`, {
    body: data,
  })
