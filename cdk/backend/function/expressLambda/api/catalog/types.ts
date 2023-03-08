export interface Catalog {
  id: string
  label: string | null
  created_at: string
  updated_at: string | null
  organization_id: string
}

export type CatalogInput = Pick<Catalog, 'label' | 'organization_id'>

export type GetCatalogInput = Pick<Catalog, 'id'>
export type UpdateCatalogInput = Omit<Catalog, 'id'>
export type DeleteCatalogInput = Pick<Catalog, 'id'>
