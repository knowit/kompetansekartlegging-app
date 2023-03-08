import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import { Question } from './types'

export const getAllQuestions = async () => apiGET<Question[]>('/questions')

export const getQuestionById = async (questionId: string) =>
  apiGET<Question>('/questions/:questionId', {
    queryStringParameters: { questionId },
  })

export const getQuestionsByCategory = async (categoryId: string) =>
  apiGET<Question[]>('/questions/:categoryId/questions', {
    queryStringParameters: { categoryId },
  })

type QuestionInput = Omit<Question, 'id'>
export const createQuestion = async (questionInfo: QuestionInput) =>
  apiPOST<Question>('/questions', {
    body: questionInfo,
  })

export const updateQuestion = async (
  questionId: string,
  questionInfo: QuestionInput
) =>
  apiPATCH<Question>('/questions', {
    queryStringParameters: { questionId },
    body: { questionInfo },
  })

export const deleteQuestion = async (questionId: string) =>
  apiDELETE<Question>('/questions/:questionId', {
    body: { questionId },
  })
