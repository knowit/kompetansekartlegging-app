interface QuestionAnswer {
  id: string
  userformid: string
  questionid: string
  knowledge: number
  motivation: number
  customscalevalue: number
  textvalue: string
}

export type QuestionAnswerInput = Omit<QuestionAnswer, 'id'>

export type GetQuestionAnswerInput = Pick<QuestionAnswer, 'id'>
export type DeleteQuestionAnswerInput = Pick<QuestionAnswer, 'id'>
