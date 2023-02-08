export interface Category {
  id: string
  text: string
  description: string
  index: number
  formdefinitionid: string
  organizationid: string
}

export type CategoryList = Category[]

export type CategoryInput = Omit<Category, 'id'>
