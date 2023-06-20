export interface QuestionAnswer {
  id: string
  user_username: string
  question_id: string
  knowledge: number | null
  motivation: number | null
  custom_scale_value: number | null
  text_value: string | null
}

export interface IQuestionAnswer {
  id: string
  user_username: string
  question_id: string
  knowledge: number | null
  motivation: number | null
  custom_scale_value: number | null
  text_value: string | null
}

export type QuestionAnswerInput = Omit<QuestionAnswer, 'id'>

export type GetQuestionAnswerInput = Pick<QuestionAnswer, 'id'>
export type GetQuestionAnswerByUserAndQuestionInput = Pick<
  QuestionAnswer,
  'user_username' | 'question_id'
>
export type DeleteQuestionAnswerInput = Pick<QuestionAnswer, 'id'>

export interface QuestionAnswerResponse {
  message: string
  status: string
  data: QuestionAnswer | null
}

export interface QuestionAnswerResponses {
  message: string
  status: string
  data: (QuestionAnswer | null)[]
}
