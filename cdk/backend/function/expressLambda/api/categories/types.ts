export interface ICategory {
  id: string
  text: string
  description: string | null
  index: number | null
  catalog_id: string
}

export type CategoryInput = Omit<ICategory, 'id'>

export type GetCategoryInCatalogInput = Pick<ICategory, 'catalog_id'>
export type GetCategoryInput = Pick<ICategory, 'id'>
export type DeleteCategoryInput = Pick<ICategory, 'id'>
