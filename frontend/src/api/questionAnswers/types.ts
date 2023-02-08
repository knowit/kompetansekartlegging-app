export interface QuestionAnswer {
  id: string
  userFormId: string
  questionId: string
  knowledge: number
  motivation: string
  customscalevalue: string
  textvalue: string
}

export type QuestionAnswerList = QuestionAnswer[]
