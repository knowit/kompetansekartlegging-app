import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import { QuestionAnswer, QuestionAnswerList } from './types'

export const getAllQuestionAnswers = async () =>
  apiGET<QuestionAnswerList>('/questionAnswers')

export const getQuestionAnswerById = async (questionAnswerId: string) =>
  apiGET<QuestionAnswerList>('/questionAnswers/:questionAnswerId', {
    queryStringParameters: { questionAnswerId },
  })

type QuestionAnswerInput = Omit<QuestionAnswer, 'id'>
export const createQuestionAnswer = async (
  questionAnswerInfo: QuestionAnswerInput
) =>
  apiPOST<QuestionAnswerList>('/questionAnswers', {
    body: questionAnswerInfo,
  })

export const updateQuestionAnswer = async (
  questionAnswerId: string,
  questionAnswerInfo: QuestionAnswerInput
) =>
  apiPATCH<QuestionAnswerList>('/questionAnswers', {
    queryStringParameters: { questionAnswerId },
    body: { questionAnswerInfo },
  })

export const deleteQuestionAnswer = async (questionAnswerId: string) =>
  apiDELETE<QuestionAnswerList>('/questionAnswers/:questionAnswerId', {
    body: { questionAnswerId },
  })

type QuestionAnswerInputList = QuestionAnswerInput[]
export const batchCreateQuestionAnswer = async (
  questionAnswerInfoList: QuestionAnswerInputList
) =>
  apiPOST<QuestionAnswerInputList>('/questionAnswers/batch', {
    body: questionAnswerInfoList,
  })
