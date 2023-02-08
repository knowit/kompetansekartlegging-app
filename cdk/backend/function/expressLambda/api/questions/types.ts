// TODO: Fix this endpoint
// ! Validate that question and questionAnswer

interface Question {
  id: string
  text: string | null
  topic: string
  index: number | null
  formdefinitionid: string
  categoryid: string
  type: 'customscalevalue' | 'knowledgemotivation' | 'text' | null
  scalestart: string | null
  scalemiddle: string | null
  scaleend: string | null
  organizationid: string
}

export type QuestionInput = Omit<Question, 'id'>

export type GetQuestionInput = Pick<Question, 'id'>
export type DeleteQuestionInput = Pick<Question, 'id'>
export type GetQuestionsByCategoryInput = Pick<Question, 'categoryid'>
