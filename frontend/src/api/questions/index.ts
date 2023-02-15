import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import { Question, QuestionList } from './types'

export const getAllQuestions = async () => apiGET<QuestionList>('/questions')

export const getQuestionById = async (questionId: string) =>
  apiGET<QuestionList>('/questions/:questionId', {
    queryStringParameters: { questionId },
  })

export const getQuestionsByCategory = async (categoryId: string) =>
  apiGET<QuestionList>('/questions/:categoryId/questions', {
    queryStringParameters: { categoryId },
  })

type QuestionInput = Omit<Question, 'id'>
export const createQuestion = async (questionInfo: QuestionInput) =>
  apiPOST<QuestionList>('/questions', {
    body: questionInfo,
  })

export const updateQuestion = async (
  questionId: string,
  questionInfo: QuestionInput
) =>
  apiPATCH<QuestionList>('/questions', {
    queryStringParameters: { questionId },
    body: { questionInfo },
  })

export const deleteQuestion = async (questionId: string) =>
  apiDELETE<QuestionList>('/questions/:questionId', {
    body: { questionId },
  })
