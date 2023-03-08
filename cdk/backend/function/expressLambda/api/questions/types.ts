// TODO: Fix this endpoint
// ! Validate that question and questionAnswer

interface Question {
  id: string
  text: string | null
  topic: string
  index: number | null
  type: 'custom_scale_value' | 'knowledge_motivation' | 'text' | null
  scale_start: string | null
  scale_middle: string | null
  scale_end: string | null
  category_id: string
}

export interface GetQuestionReqQuery {
  id: string | undefined
  category_id: string | undefined
}

export type QuestionInput = Omit<Question, 'id'>

export type GetQuestionInput = Pick<Question, 'id'>
export type DeleteQuestionInput = Pick<Question, 'id'>
export type GetQuestionsByCategoryInput = Pick<Question, 'category_id'>
