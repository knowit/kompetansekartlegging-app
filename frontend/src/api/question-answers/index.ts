import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import {
  DeleteQuestionAnswerInput,
  GetQuestionAnswerInput,
  QuestionAnswer,
  QuestionAnswerInput,
} from './types'

const path = '/question-answers'

export const getAllQuestionAnswers = async () => apiGET<QuestionAnswer[]>(path)

export const getQuestionAnswerById = async (id: GetQuestionAnswerInput) =>
  apiGET<QuestionAnswer>(`${path}`, {
    queryStringParameters: id,
  })

export const createQuestionAnswer = async (data: QuestionAnswerInput) =>
  apiPOST<QuestionAnswer>(`${path}`, {
    body: data,
  })

export const updateQuestionAnswer = async (
  id: GetQuestionAnswerInput,
  data: QuestionAnswerInput
) =>
  apiPATCH<QuestionAnswer>(`${path}`, {
    queryStringParameters: id,
    body: data,
  })

export const deleteQuestionAnswer = async (id: DeleteQuestionAnswerInput) =>
  apiDELETE<QuestionAnswer>(`${path}`, {
    body: id,
  })

export const batchCreateQuestionAnswer = async (data: QuestionAnswerInput[]) =>
  apiPOST<QuestionAnswerInput[]>(`${path}/batch`, {
    body: data,
  })
