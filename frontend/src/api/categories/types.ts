export interface Category {
  id: string
  text: string
  description: string | null
  index: number | null
  catalog_id: string
}

export type CategoryInput = Omit<Category, 'id'>

export type GetCategoryInput = Pick<Category, 'id'>
export type DeleteCategoryInput = Pick<Category, 'id'>
