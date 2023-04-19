import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import { Question } from './types'

const path = '/questions'

export const getAllQuestions = async () => apiGET<Question[]>(path)

export const getQuestionById = async (questionId: string) =>
  apiGET<Question>(`${path}/:questionId`, {
    queryStringParameters: { questionId },
  })

export const getQuestionsByCategory = async (categoryId: string) =>
  apiGET<Question[]>(`${path}/:categoryId/questions`, {
    queryStringParameters: { categoryId },
  })

type QuestionInput = Omit<Question, 'id'>
export const createQuestion = async (questionInfo: QuestionInput) =>
  apiPOST<Question>(path, {
    body: questionInfo,
  })

export const updateQuestion = async (
  questionId: string,
  questionInfo: QuestionInput
) =>
  apiPATCH<Question>(path, {
    queryStringParameters: { questionId },
    body: { questionInfo },
  })

export const deleteQuestion = async (questionId: string) =>
  apiDELETE<Question>(`${path}/:questionId`, {
    body: { questionId },
  })
