// TODO: Fix this endpoint
// ! Validate that question and questionAnswer

interface Question {
  id: string
  text: string | null
  topic: string
  index: number | null
  categoryid: string
  type: 'custom_scale_value' | 'knowledge_motivation' | 'text' | null
  scalestart: string | null
  scalemiddle: string | null
  scaleend: string | null
}

export interface GetQuestionReqQuery {
  id: string | undefined
  categoryid: string | undefined
}

export type QuestionInput = Omit<Question, 'id'>

export type GetQuestionInput = Pick<Question, 'id'>
export type DeleteQuestionInput = Pick<Question, 'id'>
export type GetQuestionsByCategoryInput = Pick<Question, 'categoryid'>
