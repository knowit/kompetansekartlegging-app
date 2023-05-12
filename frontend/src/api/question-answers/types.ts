export interface QuestionAnswer {
  id: string
  user_id: string
  question_id: string
  knowledge: number | null
  motivation: number | null
  custom_scale_value: number | null
  text_value: string | null
  updated_at: Date
}

export type QuestionAnswerInput = Omit<QuestionAnswer, 'id'>

export type GetQuestionAnswerInput = Pick<QuestionAnswer, 'id'>
export type DeleteQuestionAnswerInput = Pick<QuestionAnswer, 'id'>
