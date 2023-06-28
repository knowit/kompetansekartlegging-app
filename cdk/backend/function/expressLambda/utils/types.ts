export interface ICatalog {
  id: string
  label: string | null
  active: boolean
  created_at: string
  updated_at: string | null
  organization_id: string
}

export type CatalogInput = Pick<ICatalog, 'label'>
export type CatalogId = Pick<ICatalog, 'id'>
export type UpdateCatalogInput = Omit<ICatalog, 'id'>

// Category

export interface ICategory {
  id: string
  text: string
  description: string | null
  index: number | null
  catalog_id: string
}

export type CategoryInput = Omit<ICategory, 'id'>

export type CategoryCatalogId = Pick<ICategory, 'catalog_id'>
export type CategoryId = Pick<ICategory, 'id'>

// Cognito

export interface ICognitoBody {
  username: string
  groupname: string
}

export interface IListQuery {
  token: string
  limit: number
}

export type ListGroupsForUserQuery = IListQuery & IUsername
export type ListUsersInGroupQuery = IListQuery & Pick<ICognitoBody, 'groupname'>

// Group leader

export interface GetByUsernameAndOrganizationId extends IUsername {
  organizationId: string
}

export interface IUsername {
  username: string
}

// Group

export interface IGroup {
  id: string
  organization_id: string
  group_leader_username: string
}
export type GetGroupsInOrganizationInput = { organization: string }

export type GroupInput = Omit<IGroup, 'id'>
export type GroupId = Pick<IGroup, 'id'>
export type GroupLeaderInput = Pick<IGroup, 'group_leader_username'>

export interface IUserGroupId {
  group_id: string
}

export interface AddUserToGroupQuery {
  group_id: string
  username: string
}

// Organization

export interface IOrganization {
  id: string
  created_at: string
  organization_name: string
  identifier_attribute: string
}

export type OrganizationInput = Omit<IOrganization, 'created_at' | 'id'>

export type OrganizationId = Pick<IOrganization, 'id'>
export type OrganizationIdentifierAttribute = Pick<
  IOrganization,
  'identifier_attribute'
>

// Question answer

export interface IQuestionAnswer {
  id: string
  username: string
  question_id: string
  knowledge: number | null
  motivation: number | null
  custom_scale_value: number | null
  text_value: string | null
}

export type QuestionAnswerInput = Omit<IQuestionAnswer, 'id'>

export type QuestionAnswerId = Pick<IQuestionAnswer, 'id'>
export type GetQuestionAnswerByUserAndQuestionInput = Pick<
  IQuestionAnswer,
  'username' | 'question_id'
>

export interface IQuestionAnswerResponse {
  message: string
  status: string
  data: IQuestionAnswer | null
}

export interface IQuestionAnswerResponses {
  message: string
  status: string
  data: (IQuestionAnswer | null)[]
}

// Question

export interface IQuestion {
  id: string
  text: string | null
  topic: string
  index: number
  type: 'custom_scale_value' | 'knowledge_motivation' | 'text' | null
  scale_start: string | null
  scale_middle: string | null
  scale_end: string | null
  category_id: string
}

export interface GetQuestionReqQuery {
  id: string | undefined
  category_id: string | undefined
}

export type QuestionInput = Omit<IQuestion, 'id'>

export type QuestionId = Pick<IQuestion, 'id'>
export type QuestionCategoryId = Pick<IQuestion, 'category_id'>
