interface QuestionAnswer {
  id: string
  userid: string
  questionid: string
  knowledge: number | null
  motivation: number | null
  customscalevalue: number | null
  textvalue: string | null
}

export type QuestionAnswerInput = Omit<QuestionAnswer, 'id'>

export type GetQuestionAnswerInput = Pick<QuestionAnswer, 'id'>
export type DeleteQuestionAnswerInput = Pick<QuestionAnswer, 'id'>
