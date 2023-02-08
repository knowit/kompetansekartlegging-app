export interface Question {
  id: string
  text: string
  topic: string
  index: number
  formDefinitionId: string
  categoryId: string
  type: string
  scaleStart: number
  scaleMiddle: number
  scaleEnd: number
  organizationId: string
}

export type QuestionList = Question[]
