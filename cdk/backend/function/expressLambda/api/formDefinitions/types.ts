export interface FormDefinition {
  id: string
  label: string
  createdat: string
  updatedat: string
  organizationid: string
}

export type FormDefinitionInput = Pick<
  FormDefinition,
  'label' | 'organizationid'
>

export type GetFormDefinitionInput = Pick<FormDefinition, 'id'>
export type UpdateFormDefinitionInput = Omit<FormDefinition, 'id'>
export type DeleteFormDefinitionInput = Pick<FormDefinition, 'id'>
