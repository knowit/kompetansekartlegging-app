// TODO: Fix this endpoint
// ! Validate that question and questionAnswer

export interface IQuestion {
  id: string
  text: string | null
  topic: string
  index: number
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

export type QuestionInput = Omit<IQuestion, 'id'>

export type GetQuestionInput = Pick<IQuestion, 'id'>
export type DeleteQuestionInput = Pick<IQuestion, 'id'>
export type GetQuestionsByCategoryInput = Pick<IQuestion, 'category_id'>
