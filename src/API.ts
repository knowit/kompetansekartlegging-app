/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ModelUserFormFilterInput = {
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  formDefinitionID?: ModelIDInput | null,
  orgGroupLeaders?: ModelStringInput | null,
  orgAdmins?: ModelStringInput | null,
  and?: Array< ModelUserFormFilterInput | null > | null,
  or?: Array< ModelUserFormFilterInput | null > | null,
  not?: ModelUserFormFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelUserFormConnection = {
  __typename: "ModelUserFormConnection",
  items?:  Array<UserForm >,
  nextToken?: string | null,
};

export type UserForm = {
  __typename: "UserForm",
  id?: string,
  createdAt?: string,
  owner?: string | null,
  formDefinitionID?: string,
  questionAnswers?: ModelQuestionAnswerConnection,
  formDefinition?: FormDefinition,
  orgGroupLeaders?: string,
  orgAdmins?: string,
  updatedAt?: string,
};

export type ModelQuestionAnswerConnection = {
  __typename: "ModelQuestionAnswerConnection",
  items?:  Array<QuestionAnswer >,
  nextToken?: string | null,
};

export type QuestionAnswer = {
  __typename: "QuestionAnswer",
  id?: string,
  userFormID?: string,
  questionID?: string,
  question?: Question,
  orgGroupLeaders?: string,
  orgAdmins?: string,
  knowledge?: number | null,
  motivation?: number | null,
  customScaleValue?: number | null,
  textValue?: string | null,
  createdAt?: string,
  updatedAt?: string,
  owner?: string | null,
};

export type Question = {
  __typename: "Question",
  id?: string,
  text?: string,
  topic?: string,
  index?: number | null,
  formDefinitionID?: string,
  categoryID?: string,
  category?: Category,
  type?: QuestionType | null,
  scaleStart?: string | null,
  scaleMiddle?: string | null,
  scaleEnd?: string | null,
  orgAdmins?: string,
  organizationID?: string,
  organization?: Organization,
  createdAt?: string,
  updatedAt?: string,
};

export type Category = {
  __typename: "Category",
  id?: string,
  text?: string,
  description?: string | null,
  index?: number | null,
  formDefinitionID?: string,
  formDefinition?: FormDefinition,
  questions?: ModelQuestionConnection,
  orgAdmins?: string,
  organizationID?: string,
  organization?: Organization,
  createdAt?: string,
  updatedAt?: string,
};

export type FormDefinition = {
  __typename: "FormDefinition",
  id?: string,
  label?: string | null,
  createdAt?: string,
  sortKeyConstant?: string,
  questions?: ModelQuestionConnection,
  organizationID?: string,
  organization?: Organization,
  orgAdmins?: string,
  updatedAt?: string,
};

export type ModelQuestionConnection = {
  __typename: "ModelQuestionConnection",
  items?:  Array<Question >,
  nextToken?: string | null,
};

export type Organization = {
  __typename: "Organization",
  id?: string,
  createdAt?: string,
  owner?: string | null,
  orgname?: string,
  identifierAttribute?: string,
  updatedAt?: string,
};

export enum QuestionType {
  knowledgeMotivation = "knowledgeMotivation",
  customScaleLabels = "customScaleLabels",
  text = "text",
}


export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelFormDefinitionFilterInput = {
  id?: ModelIDInput | null,
  label?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  sortKeyConstant?: ModelStringInput | null,
  organizationID?: ModelIDInput | null,
  orgAdmins?: ModelStringInput | null,
  and?: Array< ModelFormDefinitionFilterInput | null > | null,
  or?: Array< ModelFormDefinitionFilterInput | null > | null,
  not?: ModelFormDefinitionFilterInput | null,
};

export type ModelFormDefinitionConnection = {
  __typename: "ModelFormDefinitionConnection",
  items?:  Array<FormDefinition >,
  nextToken?: string | null,
};

export type CreateQuestionAnswerInput = {
  id?: string | null,
  userFormID: string,
  questionID: string,
  knowledge?: number | null,
  motivation?: number | null,
  customScaleValue?: number | null,
  formDefinitionID: string,
  orgAdmins?: string | null,
  orgGroupLeaders?: string | null,
};

export type CreateQuestionAnswerResult = {
  __typename: "CreateQuestionAnswerResult",
  status?: number,
  error?: string | null,
  failedInputs?:  Array<CreateQuestionAnswerFailedInput | null > | null,
};

export type CreateQuestionAnswerFailedInput = {
  __typename: "CreateQuestionAnswerFailedInput",
  id?: string | null,
  userFormID?: string,
  questionID?: string,
  knowledge?: number | null,
  motivation?: number | null,
  customScaleValue?: number | null,
  formDefinitionID?: string,
};

export type CreateAPIKeyPermissionInput = {
  id?: string | null,
  APIKeyHashed: string,
  organizationID: string,
};

export type ModelAPIKeyPermissionConditionInput = {
  APIKeyHashed?: ModelStringInput | null,
  organizationID?: ModelStringInput | null,
  and?: Array< ModelAPIKeyPermissionConditionInput | null > | null,
  or?: Array< ModelAPIKeyPermissionConditionInput | null > | null,
  not?: ModelAPIKeyPermissionConditionInput | null,
};

export type APIKeyPermission = {
  __typename: "APIKeyPermission",
  id?: string,
  APIKeyHashed?: string,
  organizationID?: string,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateAPIKeyPermissionInput = {
  id: string,
  APIKeyHashed?: string | null,
  organizationID?: string | null,
};

export type DeleteAPIKeyPermissionInput = {
  id: string,
};

export type CreateOrganizationInput = {
  id?: string | null,
  createdAt?: string | null,
  owner?: string | null,
  orgname: string,
  identifierAttribute: string,
};

export type ModelOrganizationConditionInput = {
  createdAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  orgname?: ModelStringInput | null,
  identifierAttribute?: ModelStringInput | null,
  and?: Array< ModelOrganizationConditionInput | null > | null,
  or?: Array< ModelOrganizationConditionInput | null > | null,
  not?: ModelOrganizationConditionInput | null,
};

export type UpdateOrganizationInput = {
  id: string,
  createdAt?: string | null,
  owner?: string | null,
  orgname?: string | null,
  identifierAttribute?: string | null,
};

export type DeleteOrganizationInput = {
  id: string,
};

export type CreateFormDefinitionInput = {
  id?: string | null,
  label?: string | null,
  createdAt?: string | null,
  sortKeyConstant: string,
  organizationID: string,
  orgAdmins: string,
};

export type ModelFormDefinitionConditionInput = {
  label?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  sortKeyConstant?: ModelStringInput | null,
  and?: Array< ModelFormDefinitionConditionInput | null > | null,
  or?: Array< ModelFormDefinitionConditionInput | null > | null,
  not?: ModelFormDefinitionConditionInput | null,
};

export type UpdateFormDefinitionInput = {
  id: string,
  label?: string | null,
  createdAt?: string | null,
  sortKeyConstant?: string | null,
  organizationID?: string | null,
  orgAdmins?: string | null,
};

export type DeleteFormDefinitionInput = {
  id: string,
};

export type CreateUserFormInput = {
  id?: string | null,
  createdAt?: string | null,
  owner?: string | null,
  formDefinitionID: string,
  orgGroupLeaders: string,
  orgAdmins: string,
};

export type ModelUserFormConditionInput = {
  createdAt?: ModelStringInput | null,
  formDefinitionID?: ModelIDInput | null,
  and?: Array< ModelUserFormConditionInput | null > | null,
  or?: Array< ModelUserFormConditionInput | null > | null,
  not?: ModelUserFormConditionInput | null,
};

export type UpdateUserFormInput = {
  id: string,
  createdAt?: string | null,
  owner?: string | null,
  formDefinitionID?: string | null,
  orgGroupLeaders?: string | null,
  orgAdmins?: string | null,
};

export type DeleteUserFormInput = {
  id: string,
};

export type ModelQuestionAnswerConditionInput = {
  userFormID?: ModelIDInput | null,
  questionID?: ModelIDInput | null,
  knowledge?: ModelFloatInput | null,
  motivation?: ModelFloatInput | null,
  customScaleValue?: ModelFloatInput | null,
  textValue?: ModelStringInput | null,
  and?: Array< ModelQuestionAnswerConditionInput | null > | null,
  or?: Array< ModelQuestionAnswerConditionInput | null > | null,
  not?: ModelQuestionAnswerConditionInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateQuestionAnswerInput = {
  id: string,
  userFormID?: string | null,
  questionID?: string | null,
  orgGroupLeaders?: string | null,
  orgAdmins?: string | null,
  knowledge?: number | null,
  motivation?: number | null,
  customScaleValue?: number | null,
  textValue?: string | null,
};

export type DeleteQuestionAnswerInput = {
  id: string,
};

export type CreateQuestionInput = {
  id?: string | null,
  text: string,
  topic: string,
  index?: number | null,
  formDefinitionID: string,
  categoryID: string,
  type?: QuestionType | null,
  scaleStart?: string | null,
  scaleMiddle?: string | null,
  scaleEnd?: string | null,
  orgAdmins: string,
  organizationID: string,
};

export type ModelQuestionConditionInput = {
  text?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  index?: ModelIntInput | null,
  formDefinitionID?: ModelIDInput | null,
  categoryID?: ModelIDInput | null,
  type?: ModelQuestionTypeInput | null,
  scaleStart?: ModelStringInput | null,
  scaleMiddle?: ModelStringInput | null,
  scaleEnd?: ModelStringInput | null,
  and?: Array< ModelQuestionConditionInput | null > | null,
  or?: Array< ModelQuestionConditionInput | null > | null,
  not?: ModelQuestionConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelQuestionTypeInput = {
  eq?: QuestionType | null,
  ne?: QuestionType | null,
};

export type UpdateQuestionInput = {
  id: string,
  text?: string | null,
  topic?: string | null,
  index?: number | null,
  formDefinitionID?: string | null,
  categoryID?: string | null,
  type?: QuestionType | null,
  scaleStart?: string | null,
  scaleMiddle?: string | null,
  scaleEnd?: string | null,
  orgAdmins?: string | null,
  organizationID?: string | null,
};

export type DeleteQuestionInput = {
  id: string,
};

export type CreateCategoryInput = {
  id?: string | null,
  text: string,
  description?: string | null,
  index?: number | null,
  formDefinitionID: string,
  orgAdmins: string,
  organizationID: string,
};

export type ModelCategoryConditionInput = {
  text?: ModelStringInput | null,
  description?: ModelStringInput | null,
  index?: ModelIntInput | null,
  formDefinitionID?: ModelIDInput | null,
  and?: Array< ModelCategoryConditionInput | null > | null,
  or?: Array< ModelCategoryConditionInput | null > | null,
  not?: ModelCategoryConditionInput | null,
};

export type UpdateCategoryInput = {
  id: string,
  text?: string | null,
  description?: string | null,
  index?: number | null,
  formDefinitionID?: string | null,
  orgAdmins?: string | null,
  organizationID?: string | null,
};

export type DeleteCategoryInput = {
  id: string,
};

export type CreateGroupInput = {
  id?: string | null,
  groupLeaderUsername: string,
  organizationID: string,
  orgGroupLeaders: string,
  orgAdmins: string,
};

export type ModelGroupConditionInput = {
  groupLeaderUsername?: ModelStringInput | null,
  organizationID?: ModelIDInput | null,
  and?: Array< ModelGroupConditionInput | null > | null,
  or?: Array< ModelGroupConditionInput | null > | null,
  not?: ModelGroupConditionInput | null,
};

export type Group = {
  __typename: "Group",
  id?: string,
  groupLeaderUsername?: string,
  organizationID?: string,
  organization?: Organization,
  orgGroupLeaders?: string,
  orgAdmins?: string,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateGroupInput = {
  id: string,
  groupLeaderUsername?: string | null,
  organizationID?: string | null,
  orgGroupLeaders?: string | null,
  orgAdmins?: string | null,
};

export type DeleteGroupInput = {
  id: string,
};

export type CreateUserInput = {
  id?: string | null,
  groupID: string,
  organizationID: string,
  orgAdmins: string,
  orgGroupLeaders: string,
};

export type ModelUserConditionInput = {
  groupID?: ModelIDInput | null,
  organizationID?: ModelIDInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type User = {
  __typename: "User",
  id?: string,
  groupID?: string,
  group?: Group,
  organizationID?: string,
  organization?: Organization,
  orgAdmins?: string,
  orgGroupLeaders?: string,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateUserInput = {
  id: string,
  groupID?: string | null,
  organizationID?: string | null,
  orgAdmins?: string | null,
  orgGroupLeaders?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type ModelAPIKeyPermissionFilterInput = {
  id?: ModelIDInput | null,
  APIKeyHashed?: ModelStringInput | null,
  organizationID?: ModelStringInput | null,
  and?: Array< ModelAPIKeyPermissionFilterInput | null > | null,
  or?: Array< ModelAPIKeyPermissionFilterInput | null > | null,
  not?: ModelAPIKeyPermissionFilterInput | null,
};

export type ModelAPIKeyPermissionConnection = {
  __typename: "ModelAPIKeyPermissionConnection",
  items?:  Array<APIKeyPermission >,
  nextToken?: string | null,
};

export type ModelOrganizationFilterInput = {
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  orgname?: ModelStringInput | null,
  identifierAttribute?: ModelStringInput | null,
  and?: Array< ModelOrganizationFilterInput | null > | null,
  or?: Array< ModelOrganizationFilterInput | null > | null,
  not?: ModelOrganizationFilterInput | null,
};

export type ModelOrganizationConnection = {
  __typename: "ModelOrganizationConnection",
  items?:  Array<Organization >,
  nextToken?: string | null,
};

export type ModelQuestionAnswerFilterInput = {
  id?: ModelIDInput | null,
  userFormID?: ModelIDInput | null,
  questionID?: ModelIDInput | null,
  orgGroupLeaders?: ModelStringInput | null,
  orgAdmins?: ModelStringInput | null,
  knowledge?: ModelFloatInput | null,
  motivation?: ModelFloatInput | null,
  customScaleValue?: ModelFloatInput | null,
  textValue?: ModelStringInput | null,
  and?: Array< ModelQuestionAnswerFilterInput | null > | null,
  or?: Array< ModelQuestionAnswerFilterInput | null > | null,
  not?: ModelQuestionAnswerFilterInput | null,
};

export type ModelQuestionFilterInput = {
  id?: ModelIDInput | null,
  text?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  index?: ModelIntInput | null,
  formDefinitionID?: ModelIDInput | null,
  categoryID?: ModelIDInput | null,
  type?: ModelQuestionTypeInput | null,
  scaleStart?: ModelStringInput | null,
  scaleMiddle?: ModelStringInput | null,
  scaleEnd?: ModelStringInput | null,
  orgAdmins?: ModelStringInput | null,
  organizationID?: ModelIDInput | null,
  and?: Array< ModelQuestionFilterInput | null > | null,
  or?: Array< ModelQuestionFilterInput | null > | null,
  not?: ModelQuestionFilterInput | null,
};

export type ModelCategoryFilterInput = {
  id?: ModelIDInput | null,
  text?: ModelStringInput | null,
  description?: ModelStringInput | null,
  index?: ModelIntInput | null,
  formDefinitionID?: ModelIDInput | null,
  orgAdmins?: ModelStringInput | null,
  organizationID?: ModelIDInput | null,
  and?: Array< ModelCategoryFilterInput | null > | null,
  or?: Array< ModelCategoryFilterInput | null > | null,
  not?: ModelCategoryFilterInput | null,
};

export type ModelCategoryConnection = {
  __typename: "ModelCategoryConnection",
  items?:  Array<Category >,
  nextToken?: string | null,
};

export type ModelGroupFilterInput = {
  id?: ModelIDInput | null,
  groupLeaderUsername?: ModelStringInput | null,
  organizationID?: ModelIDInput | null,
  orgGroupLeaders?: ModelStringInput | null,
  orgAdmins?: ModelStringInput | null,
  and?: Array< ModelGroupFilterInput | null > | null,
  or?: Array< ModelGroupFilterInput | null > | null,
  not?: ModelGroupFilterInput | null,
};

export type ModelGroupConnection = {
  __typename: "ModelGroupConnection",
  items?:  Array<Group >,
  nextToken?: string | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  groupID?: ModelIDInput | null,
  organizationID?: ModelIDInput | null,
  orgAdmins?: ModelStringInput | null,
  orgGroupLeaders?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items?:  Array<User >,
  nextToken?: string | null,
};

export type ListUserFormsWithAnswersQueryVariables = {
  filter?: ModelUserFormFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserFormsWithAnswersQuery = {
  listUserForms?:  {
    __typename: "ModelUserFormConnection",
    items:  Array< {
      __typename: "UserForm",
      id: string,
      createdAt: string,
      formDefinitionID: string,
      questionAnswers?:  {
        __typename: "ModelQuestionAnswerConnection",
        items:  Array< {
          __typename: "QuestionAnswer",
          id: string,
          knowledge?: number | null,
          motivation?: number | null,
          createdAt: string,
          question?:  {
            __typename: "Question",
            id: string,
            category?:  {
              __typename: "Category",
              text: string,
              id: string,
            } | null,
          } | null,
        } >,
      } | null,
    } >,
    nextToken?: string | null,
  } | null,
};

export type FormByCreatedAttQueryVariables = {
  sortKeyConstant?: string | null,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFormDefinitionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FormByCreatedAttQuery = {
  formByCreatedAt?:  {
    __typename: "ModelFormDefinitionConnection",
    items:  Array< {
      __typename: "FormDefinition",
      id: string,
      createdAt: string,
      questions?:  {
        __typename: "ModelQuestionConnection",
        items:  Array< {
          __typename: "Question",
          category?:  {
            __typename: "Category",
            id: string,
            text: string,
            description?: string | null,
            index?: number | null,
          } | null,
          index?: number | null,
          id: string,
          createdAt: string,
          text: string,
          topic: string,
        } >,
      } | null,
    } >,
    nextToken?: string | null,
  } | null,
};

export type FormByCreatedAtPaginatedQueryVariables = {
  sortKeyConstant?: string | null,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFormDefinitionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  nextFormToken?: string | null,
};

export type FormByCreatedAtPaginatedQuery = {
  formByCreatedAt?:  {
    __typename: "ModelFormDefinitionConnection",
    items:  Array< {
      __typename: "FormDefinition",
      id: string,
      createdAt: string,
      questions?:  {
        __typename: "ModelQuestionConnection",
        items:  Array< {
          __typename: "Question",
          category?:  {
            __typename: "Category",
            id: string,
            text: string,
            description?: string | null,
            index?: number | null,
          } | null,
          index?: number | null,
          id: string,
          createdAt: string,
          text: string,
          topic: string,
          type?: QuestionType | null,
          scaleStart?: string | null,
          scaleMiddle?: string | null,
          scaleEnd?: string | null,
        } >,
        nextToken?: string | null,
      } | null,
    } >,
    nextToken?: string | null,
  } | null,
};

export type CustomUserFormByCreatedAtQueryVariables = {
  owner?: string | null,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFormFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type CustomUserFormByCreatedAtQuery = {
  userFormByCreatedAt?:  {
    __typename: "ModelUserFormConnection",
    items:  Array< {
      __typename: "UserForm",
      id: string,
      formDefinitionID: string,
      questionAnswers?:  {
        __typename: "ModelQuestionAnswerConnection",
        items:  Array< {
          __typename: "QuestionAnswer",
          id: string,
          knowledge?: number | null,
          motivation?: number | null,
          updatedAt: string,
          customScaleValue?: number | null,
          question?:  {
            __typename: "Question",
            id: string,
            text: string,
            topic: string,
            type?: QuestionType | null,
            category?:  {
              __typename: "Category",
              id: string,
              text: string,
              description?: string | null,
              index?: number | null,
            } | null,
          } | null,
        } >,
        nextToken?: string | null,
      } | null,
    } >,
  } | null,
};

export type BatchCreateQuestionAnswer2MutationVariables = {
  input?: Array< CreateQuestionAnswerInput | null > | null,
  organizationID?: string | null,
};

export type BatchCreateQuestionAnswer2Mutation = {
  batchCreateQuestionAnswer?:  {
    __typename: "CreateQuestionAnswerResult",
    status: number,
    error?: string | null,
    failedInputs?:  Array< {
      __typename: "CreateQuestionAnswerFailedInput",
      id?: string | null,
      userFormID: string,
      questionID: string,
      knowledge?: number | null,
      motivation?: number | null,
      formDefinitionID: string,
    } | null > | null,
  } | null,
};

export type BatchCreateQuestionAnswerMutationVariables = {
  input?: Array< CreateQuestionAnswerInput | null > | null,
  organizationID?: string | null,
};

export type BatchCreateQuestionAnswerMutation = {
  batchCreateQuestionAnswer?:  {
    __typename: "CreateQuestionAnswerResult",
    status: number,
    error?: string | null,
    failedInputs?:  Array< {
      __typename: "CreateQuestionAnswerFailedInput",
      id?: string | null,
      userFormID: string,
      questionID: string,
      knowledge?: number | null,
      motivation?: number | null,
      customScaleValue?: number | null,
      formDefinitionID: string,
    } | null > | null,
  } | null,
};

export type CreateApiKeyPermissionMutationVariables = {
  input?: CreateAPIKeyPermissionInput,
  condition?: ModelAPIKeyPermissionConditionInput | null,
};

export type CreateApiKeyPermissionMutation = {
  createAPIKeyPermission?:  {
    __typename: "APIKeyPermission",
    id: string,
    APIKeyHashed: string,
    organizationID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateApiKeyPermissionMutationVariables = {
  input?: UpdateAPIKeyPermissionInput,
  condition?: ModelAPIKeyPermissionConditionInput | null,
};

export type UpdateApiKeyPermissionMutation = {
  updateAPIKeyPermission?:  {
    __typename: "APIKeyPermission",
    id: string,
    APIKeyHashed: string,
    organizationID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteApiKeyPermissionMutationVariables = {
  input?: DeleteAPIKeyPermissionInput,
  condition?: ModelAPIKeyPermissionConditionInput | null,
};

export type DeleteApiKeyPermissionMutation = {
  deleteAPIKeyPermission?:  {
    __typename: "APIKeyPermission",
    id: string,
    APIKeyHashed: string,
    organizationID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateOrganizationMutationVariables = {
  input?: CreateOrganizationInput,
  condition?: ModelOrganizationConditionInput | null,
};

export type CreateOrganizationMutation = {
  createOrganization?:  {
    __typename: "Organization",
    id: string,
    createdAt: string,
    owner?: string | null,
    orgname: string,
    identifierAttribute: string,
    updatedAt: string,
  } | null,
};

export type UpdateOrganizationMutationVariables = {
  input?: UpdateOrganizationInput,
  condition?: ModelOrganizationConditionInput | null,
};

export type UpdateOrganizationMutation = {
  updateOrganization?:  {
    __typename: "Organization",
    id: string,
    createdAt: string,
    owner?: string | null,
    orgname: string,
    identifierAttribute: string,
    updatedAt: string,
  } | null,
};

export type DeleteOrganizationMutationVariables = {
  input?: DeleteOrganizationInput,
  condition?: ModelOrganizationConditionInput | null,
};

export type DeleteOrganizationMutation = {
  deleteOrganization?:  {
    __typename: "Organization",
    id: string,
    createdAt: string,
    owner?: string | null,
    orgname: string,
    identifierAttribute: string,
    updatedAt: string,
  } | null,
};

export type CreateFormDefinitionMutationVariables = {
  input?: CreateFormDefinitionInput,
  condition?: ModelFormDefinitionConditionInput | null,
};

export type CreateFormDefinitionMutation = {
  createFormDefinition?:  {
    __typename: "FormDefinition",
    id: string,
    label?: string | null,
    createdAt: string,
    sortKeyConstant: string,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type UpdateFormDefinitionMutationVariables = {
  input?: UpdateFormDefinitionInput,
  condition?: ModelFormDefinitionConditionInput | null,
};

export type UpdateFormDefinitionMutation = {
  updateFormDefinition?:  {
    __typename: "FormDefinition",
    id: string,
    label?: string | null,
    createdAt: string,
    sortKeyConstant: string,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type DeleteFormDefinitionMutationVariables = {
  input?: DeleteFormDefinitionInput,
  condition?: ModelFormDefinitionConditionInput | null,
};

export type DeleteFormDefinitionMutation = {
  deleteFormDefinition?:  {
    __typename: "FormDefinition",
    id: string,
    label?: string | null,
    createdAt: string,
    sortKeyConstant: string,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type CreateUserFormMutationVariables = {
  input?: CreateUserFormInput,
  condition?: ModelUserFormConditionInput | null,
};

export type CreateUserFormMutation = {
  createUserForm?:  {
    __typename: "UserForm",
    id: string,
    createdAt: string,
    owner?: string | null,
    formDefinitionID: string,
    questionAnswers?:  {
      __typename: "ModelQuestionAnswerConnection",
      nextToken?: string | null,
    } | null,
    formDefinition:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    },
    orgGroupLeaders: string,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserFormMutationVariables = {
  input?: UpdateUserFormInput,
  condition?: ModelUserFormConditionInput | null,
};

export type UpdateUserFormMutation = {
  updateUserForm?:  {
    __typename: "UserForm",
    id: string,
    createdAt: string,
    owner?: string | null,
    formDefinitionID: string,
    questionAnswers?:  {
      __typename: "ModelQuestionAnswerConnection",
      nextToken?: string | null,
    } | null,
    formDefinition:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    },
    orgGroupLeaders: string,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserFormMutationVariables = {
  input?: DeleteUserFormInput,
  condition?: ModelUserFormConditionInput | null,
};

export type DeleteUserFormMutation = {
  deleteUserForm?:  {
    __typename: "UserForm",
    id: string,
    createdAt: string,
    owner?: string | null,
    formDefinitionID: string,
    questionAnswers?:  {
      __typename: "ModelQuestionAnswerConnection",
      nextToken?: string | null,
    } | null,
    formDefinition:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    },
    orgGroupLeaders: string,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type CreateQuestionAnswerMutationVariables = {
  input?: CreateQuestionAnswerInput,
  condition?: ModelQuestionAnswerConditionInput | null,
};

export type CreateQuestionAnswerMutation = {
  createQuestionAnswer?:  {
    __typename: "QuestionAnswer",
    id: string,
    userFormID: string,
    questionID: string,
    question?:  {
      __typename: "Question",
      id: string,
      text: string,
      topic: string,
      index?: number | null,
      formDefinitionID: string,
      categoryID: string,
      type?: QuestionType | null,
      scaleStart?: string | null,
      scaleMiddle?: string | null,
      scaleEnd?: string | null,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    knowledge?: number | null,
    motivation?: number | null,
    customScaleValue?: number | null,
    textValue?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateQuestionAnswerMutationVariables = {
  input?: UpdateQuestionAnswerInput,
  condition?: ModelQuestionAnswerConditionInput | null,
};

export type UpdateQuestionAnswerMutation = {
  updateQuestionAnswer?:  {
    __typename: "QuestionAnswer",
    id: string,
    userFormID: string,
    questionID: string,
    question?:  {
      __typename: "Question",
      id: string,
      text: string,
      topic: string,
      index?: number | null,
      formDefinitionID: string,
      categoryID: string,
      type?: QuestionType | null,
      scaleStart?: string | null,
      scaleMiddle?: string | null,
      scaleEnd?: string | null,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    knowledge?: number | null,
    motivation?: number | null,
    customScaleValue?: number | null,
    textValue?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteQuestionAnswerMutationVariables = {
  input?: DeleteQuestionAnswerInput,
  condition?: ModelQuestionAnswerConditionInput | null,
};

export type DeleteQuestionAnswerMutation = {
  deleteQuestionAnswer?:  {
    __typename: "QuestionAnswer",
    id: string,
    userFormID: string,
    questionID: string,
    question?:  {
      __typename: "Question",
      id: string,
      text: string,
      topic: string,
      index?: number | null,
      formDefinitionID: string,
      categoryID: string,
      type?: QuestionType | null,
      scaleStart?: string | null,
      scaleMiddle?: string | null,
      scaleEnd?: string | null,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    knowledge?: number | null,
    motivation?: number | null,
    customScaleValue?: number | null,
    textValue?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateQuestionMutationVariables = {
  input?: CreateQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type CreateQuestionMutation = {
  createQuestion?:  {
    __typename: "Question",
    id: string,
    text: string,
    topic: string,
    index?: number | null,
    formDefinitionID: string,
    categoryID: string,
    category?:  {
      __typename: "Category",
      id: string,
      text: string,
      description?: string | null,
      index?: number | null,
      formDefinitionID: string,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    type?: QuestionType | null,
    scaleStart?: string | null,
    scaleMiddle?: string | null,
    scaleEnd?: string | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateQuestionMutationVariables = {
  input?: UpdateQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type UpdateQuestionMutation = {
  updateQuestion?:  {
    __typename: "Question",
    id: string,
    text: string,
    topic: string,
    index?: number | null,
    formDefinitionID: string,
    categoryID: string,
    category?:  {
      __typename: "Category",
      id: string,
      text: string,
      description?: string | null,
      index?: number | null,
      formDefinitionID: string,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    type?: QuestionType | null,
    scaleStart?: string | null,
    scaleMiddle?: string | null,
    scaleEnd?: string | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteQuestionMutationVariables = {
  input?: DeleteQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type DeleteQuestionMutation = {
  deleteQuestion?:  {
    __typename: "Question",
    id: string,
    text: string,
    topic: string,
    index?: number | null,
    formDefinitionID: string,
    categoryID: string,
    category?:  {
      __typename: "Category",
      id: string,
      text: string,
      description?: string | null,
      index?: number | null,
      formDefinitionID: string,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    type?: QuestionType | null,
    scaleStart?: string | null,
    scaleMiddle?: string | null,
    scaleEnd?: string | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateCategoryMutationVariables = {
  input?: CreateCategoryInput,
  condition?: ModelCategoryConditionInput | null,
};

export type CreateCategoryMutation = {
  createCategory?:  {
    __typename: "Category",
    id: string,
    text: string,
    description?: string | null,
    index?: number | null,
    formDefinitionID: string,
    formDefinition?:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    } | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCategoryMutationVariables = {
  input?: UpdateCategoryInput,
  condition?: ModelCategoryConditionInput | null,
};

export type UpdateCategoryMutation = {
  updateCategory?:  {
    __typename: "Category",
    id: string,
    text: string,
    description?: string | null,
    index?: number | null,
    formDefinitionID: string,
    formDefinition?:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    } | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCategoryMutationVariables = {
  input?: DeleteCategoryInput,
  condition?: ModelCategoryConditionInput | null,
};

export type DeleteCategoryMutation = {
  deleteCategory?:  {
    __typename: "Category",
    id: string,
    text: string,
    description?: string | null,
    index?: number | null,
    formDefinitionID: string,
    formDefinition?:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    } | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateGroupMutationVariables = {
  input?: CreateGroupInput,
  condition?: ModelGroupConditionInput | null,
};

export type CreateGroupMutation = {
  createGroup?:  {
    __typename: "Group",
    id: string,
    groupLeaderUsername: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateGroupMutationVariables = {
  input?: UpdateGroupInput,
  condition?: ModelGroupConditionInput | null,
};

export type UpdateGroupMutation = {
  updateGroup?:  {
    __typename: "Group",
    id: string,
    groupLeaderUsername: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteGroupMutationVariables = {
  input?: DeleteGroupInput,
  condition?: ModelGroupConditionInput | null,
};

export type DeleteGroupMutation = {
  deleteGroup?:  {
    __typename: "Group",
    id: string,
    groupLeaderUsername: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserMutationVariables = {
  input?: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    groupID: string,
    group:  {
      __typename: "Group",
      id: string,
      groupLeaderUsername: string,
      organizationID: string,
      orgGroupLeaders: string,
      orgAdmins: string,
      createdAt: string,
      updatedAt: string,
    },
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    orgGroupLeaders: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  input?: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    groupID: string,
    group:  {
      __typename: "Group",
      id: string,
      groupLeaderUsername: string,
      organizationID: string,
      orgGroupLeaders: string,
      orgAdmins: string,
      createdAt: string,
      updatedAt: string,
    },
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    orgGroupLeaders: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  input?: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    groupID: string,
    group:  {
      __typename: "Group",
      id: string,
      groupLeaderUsername: string,
      organizationID: string,
      orgGroupLeaders: string,
      orgAdmins: string,
      createdAt: string,
      updatedAt: string,
    },
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    orgGroupLeaders: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetApiKeyPermissionQueryVariables = {
  id?: string,
};

export type GetApiKeyPermissionQuery = {
  getAPIKeyPermission?:  {
    __typename: "APIKeyPermission",
    id: string,
    APIKeyHashed: string,
    organizationID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListApiKeyPermissionsQueryVariables = {
  filter?: ModelAPIKeyPermissionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListApiKeyPermissionsQuery = {
  listAPIKeyPermissions?:  {
    __typename: "ModelAPIKeyPermissionConnection",
    items:  Array< {
      __typename: "APIKeyPermission",
      id: string,
      APIKeyHashed: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type GetOrganizationQueryVariables = {
  id?: string,
};

export type GetOrganizationQuery = {
  getOrganization?:  {
    __typename: "Organization",
    id: string,
    createdAt: string,
    owner?: string | null,
    orgname: string,
    identifierAttribute: string,
    updatedAt: string,
  } | null,
};

export type ListOrganizationsQueryVariables = {
  filter?: ModelOrganizationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOrganizationsQuery = {
  listOrganizations?:  {
    __typename: "ModelOrganizationConnection",
    items:  Array< {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type GetFormDefinitionQueryVariables = {
  id?: string,
};

export type GetFormDefinitionQuery = {
  getFormDefinition?:  {
    __typename: "FormDefinition",
    id: string,
    label?: string | null,
    createdAt: string,
    sortKeyConstant: string,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type ListFormDefinitionsQueryVariables = {
  filter?: ModelFormDefinitionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFormDefinitionsQuery = {
  listFormDefinitions?:  {
    __typename: "ModelFormDefinitionConnection",
    items:  Array< {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type GetUserFormQueryVariables = {
  id?: string,
};

export type GetUserFormQuery = {
  getUserForm?:  {
    __typename: "UserForm",
    id: string,
    createdAt: string,
    owner?: string | null,
    formDefinitionID: string,
    questionAnswers?:  {
      __typename: "ModelQuestionAnswerConnection",
      nextToken?: string | null,
    } | null,
    formDefinition:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    },
    orgGroupLeaders: string,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type ListUserFormsQueryVariables = {
  filter?: ModelUserFormFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserFormsQuery = {
  listUserForms?:  {
    __typename: "ModelUserFormConnection",
    items:  Array< {
      __typename: "UserForm",
      id: string,
      createdAt: string,
      owner?: string | null,
      formDefinitionID: string,
      orgGroupLeaders: string,
      orgAdmins: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type GetQuestionAnswerQueryVariables = {
  id?: string,
};

export type GetQuestionAnswerQuery = {
  getQuestionAnswer?:  {
    __typename: "QuestionAnswer",
    id: string,
    userFormID: string,
    questionID: string,
    question?:  {
      __typename: "Question",
      id: string,
      text: string,
      topic: string,
      index?: number | null,
      formDefinitionID: string,
      categoryID: string,
      type?: QuestionType | null,
      scaleStart?: string | null,
      scaleMiddle?: string | null,
      scaleEnd?: string | null,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    knowledge?: number | null,
    motivation?: number | null,
    customScaleValue?: number | null,
    textValue?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListQuestionAnswersQueryVariables = {
  filter?: ModelQuestionAnswerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListQuestionAnswersQuery = {
  listQuestionAnswers?:  {
    __typename: "ModelQuestionAnswerConnection",
    items:  Array< {
      __typename: "QuestionAnswer",
      id: string,
      userFormID: string,
      questionID: string,
      orgGroupLeaders: string,
      orgAdmins: string,
      knowledge?: number | null,
      motivation?: number | null,
      customScaleValue?: number | null,
      textValue?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } >,
    nextToken?: string | null,
  } | null,
};

export type GetQuestionQueryVariables = {
  id?: string,
};

export type GetQuestionQuery = {
  getQuestion?:  {
    __typename: "Question",
    id: string,
    text: string,
    topic: string,
    index?: number | null,
    formDefinitionID: string,
    categoryID: string,
    category?:  {
      __typename: "Category",
      id: string,
      text: string,
      description?: string | null,
      index?: number | null,
      formDefinitionID: string,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    type?: QuestionType | null,
    scaleStart?: string | null,
    scaleMiddle?: string | null,
    scaleEnd?: string | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListQuestionsQueryVariables = {
  filter?: ModelQuestionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListQuestionsQuery = {
  listQuestions?:  {
    __typename: "ModelQuestionConnection",
    items:  Array< {
      __typename: "Question",
      id: string,
      text: string,
      topic: string,
      index?: number | null,
      formDefinitionID: string,
      categoryID: string,
      type?: QuestionType | null,
      scaleStart?: string | null,
      scaleMiddle?: string | null,
      scaleEnd?: string | null,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type GetCategoryQueryVariables = {
  id?: string,
};

export type GetCategoryQuery = {
  getCategory?:  {
    __typename: "Category",
    id: string,
    text: string,
    description?: string | null,
    index?: number | null,
    formDefinitionID: string,
    formDefinition?:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    } | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListCategorysQueryVariables = {
  filter?: ModelCategoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCategorysQuery = {
  listCategorys?:  {
    __typename: "ModelCategoryConnection",
    items:  Array< {
      __typename: "Category",
      id: string,
      text: string,
      description?: string | null,
      index?: number | null,
      formDefinitionID: string,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type GetGroupQueryVariables = {
  id?: string,
};

export type GetGroupQuery = {
  getGroup?:  {
    __typename: "Group",
    id: string,
    groupLeaderUsername: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListGroupsQueryVariables = {
  filter?: ModelGroupFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGroupsQuery = {
  listGroups?:  {
    __typename: "ModelGroupConnection",
    items:  Array< {
      __typename: "Group",
      id: string,
      groupLeaderUsername: string,
      organizationID: string,
      orgGroupLeaders: string,
      orgAdmins: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id?: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    groupID: string,
    group:  {
      __typename: "Group",
      id: string,
      groupLeaderUsername: string,
      organizationID: string,
      orgGroupLeaders: string,
      orgAdmins: string,
      createdAt: string,
      updatedAt: string,
    },
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    orgGroupLeaders: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      groupID: string,
      organizationID: string,
      orgAdmins: string,
      orgGroupLeaders: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type OrganizationByApiKeyHashedQueryVariables = {
  APIKeyHashed?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAPIKeyPermissionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type OrganizationByApiKeyHashedQuery = {
  organizationByAPIKeyHashed?:  {
    __typename: "ModelAPIKeyPermissionConnection",
    items:  Array< {
      __typename: "APIKeyPermission",
      id: string,
      APIKeyHashed: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type OrganizationByIdentifierAttributeQueryVariables = {
  identifierAttribute?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelOrganizationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type OrganizationByIdentifierAttributeQuery = {
  organizationByIdentifierAttribute?:  {
    __typename: "ModelOrganizationConnection",
    items:  Array< {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type FormByCreatedAtQueryVariables = {
  sortKeyConstant?: string | null,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFormDefinitionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FormByCreatedAtQuery = {
  formByCreatedAt?:  {
    __typename: "ModelFormDefinitionConnection",
    items:  Array< {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type FormByOrganizationByCreatedAtQueryVariables = {
  organizationID?: string | null,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFormDefinitionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FormByOrganizationByCreatedAtQuery = {
  formByOrganizationByCreatedAt?:  {
    __typename: "ModelFormDefinitionConnection",
    items:  Array< {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type FormDefinitionByOrganizationIdQueryVariables = {
  organizationID?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFormDefinitionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FormDefinitionByOrganizationIdQuery = {
  formDefinitionByOrganizationID?:  {
    __typename: "ModelFormDefinitionConnection",
    items:  Array< {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type UserFormByCreatedAtQueryVariables = {
  owner?: string | null,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFormFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserFormByCreatedAtQuery = {
  userFormByCreatedAt?:  {
    __typename: "ModelUserFormConnection",
    items:  Array< {
      __typename: "UserForm",
      id: string,
      createdAt: string,
      owner?: string | null,
      formDefinitionID: string,
      orgGroupLeaders: string,
      orgAdmins: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type QuestionsByFormDefinitionQueryVariables = {
  formDefinitionID?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelQuestionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type QuestionsByFormDefinitionQuery = {
  questionsByFormDefinition?:  {
    __typename: "ModelQuestionConnection",
    items:  Array< {
      __typename: "Question",
      id: string,
      text: string,
      topic: string,
      index?: number | null,
      formDefinitionID: string,
      categoryID: string,
      type?: QuestionType | null,
      scaleStart?: string | null,
      scaleMiddle?: string | null,
      scaleEnd?: string | null,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type QuestionsByCategoryQueryVariables = {
  categoryID?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelQuestionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type QuestionsByCategoryQuery = {
  questionsByCategory?:  {
    __typename: "ModelQuestionConnection",
    items:  Array< {
      __typename: "Question",
      id: string,
      text: string,
      topic: string,
      index?: number | null,
      formDefinitionID: string,
      categoryID: string,
      type?: QuestionType | null,
      scaleStart?: string | null,
      scaleMiddle?: string | null,
      scaleEnd?: string | null,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type CategoriesByFormDefinitionQueryVariables = {
  formDefinitionID?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCategoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type CategoriesByFormDefinitionQuery = {
  categoriesByFormDefinition?:  {
    __typename: "ModelCategoryConnection",
    items:  Array< {
      __typename: "Category",
      id: string,
      text: string,
      description?: string | null,
      index?: number | null,
      formDefinitionID: string,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type UsersByGroupQueryVariables = {
  groupID?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByGroupQuery = {
  usersByGroup?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      groupID: string,
      organizationID: string,
      orgAdmins: string,
      orgGroupLeaders: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateApiKeyPermissionSubscription = {
  onCreateAPIKeyPermission?:  {
    __typename: "APIKeyPermission",
    id: string,
    APIKeyHashed: string,
    organizationID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateApiKeyPermissionSubscription = {
  onUpdateAPIKeyPermission?:  {
    __typename: "APIKeyPermission",
    id: string,
    APIKeyHashed: string,
    organizationID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteApiKeyPermissionSubscription = {
  onDeleteAPIKeyPermission?:  {
    __typename: "APIKeyPermission",
    id: string,
    APIKeyHashed: string,
    organizationID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateOrganizationSubscription = {
  onCreateOrganization?:  {
    __typename: "Organization",
    id: string,
    createdAt: string,
    owner?: string | null,
    orgname: string,
    identifierAttribute: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateOrganizationSubscription = {
  onUpdateOrganization?:  {
    __typename: "Organization",
    id: string,
    createdAt: string,
    owner?: string | null,
    orgname: string,
    identifierAttribute: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteOrganizationSubscription = {
  onDeleteOrganization?:  {
    __typename: "Organization",
    id: string,
    createdAt: string,
    owner?: string | null,
    orgname: string,
    identifierAttribute: string,
    updatedAt: string,
  } | null,
};

export type OnCreateFormDefinitionSubscription = {
  onCreateFormDefinition?:  {
    __typename: "FormDefinition",
    id: string,
    label?: string | null,
    createdAt: string,
    sortKeyConstant: string,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFormDefinitionSubscription = {
  onUpdateFormDefinition?:  {
    __typename: "FormDefinition",
    id: string,
    label?: string | null,
    createdAt: string,
    sortKeyConstant: string,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteFormDefinitionSubscription = {
  onDeleteFormDefinition?:  {
    __typename: "FormDefinition",
    id: string,
    label?: string | null,
    createdAt: string,
    sortKeyConstant: string,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserFormSubscriptionVariables = {
  owner?: string,
};

export type OnCreateUserFormSubscription = {
  onCreateUserForm?:  {
    __typename: "UserForm",
    id: string,
    createdAt: string,
    owner?: string | null,
    formDefinitionID: string,
    questionAnswers?:  {
      __typename: "ModelQuestionAnswerConnection",
      nextToken?: string | null,
    } | null,
    formDefinition:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    },
    orgGroupLeaders: string,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserFormSubscriptionVariables = {
  owner?: string,
};

export type OnUpdateUserFormSubscription = {
  onUpdateUserForm?:  {
    __typename: "UserForm",
    id: string,
    createdAt: string,
    owner?: string | null,
    formDefinitionID: string,
    questionAnswers?:  {
      __typename: "ModelQuestionAnswerConnection",
      nextToken?: string | null,
    } | null,
    formDefinition:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    },
    orgGroupLeaders: string,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserFormSubscriptionVariables = {
  owner?: string,
};

export type OnDeleteUserFormSubscription = {
  onDeleteUserForm?:  {
    __typename: "UserForm",
    id: string,
    createdAt: string,
    owner?: string | null,
    formDefinitionID: string,
    questionAnswers?:  {
      __typename: "ModelQuestionAnswerConnection",
      nextToken?: string | null,
    } | null,
    formDefinition:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    },
    orgGroupLeaders: string,
    orgAdmins: string,
    updatedAt: string,
  } | null,
};

export type OnCreateQuestionAnswerSubscriptionVariables = {
  owner?: string,
};

export type OnCreateQuestionAnswerSubscription = {
  onCreateQuestionAnswer?:  {
    __typename: "QuestionAnswer",
    id: string,
    userFormID: string,
    questionID: string,
    question?:  {
      __typename: "Question",
      id: string,
      text: string,
      topic: string,
      index?: number | null,
      formDefinitionID: string,
      categoryID: string,
      type?: QuestionType | null,
      scaleStart?: string | null,
      scaleMiddle?: string | null,
      scaleEnd?: string | null,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    knowledge?: number | null,
    motivation?: number | null,
    customScaleValue?: number | null,
    textValue?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateQuestionAnswerSubscriptionVariables = {
  owner?: string,
};

export type OnUpdateQuestionAnswerSubscription = {
  onUpdateQuestionAnswer?:  {
    __typename: "QuestionAnswer",
    id: string,
    userFormID: string,
    questionID: string,
    question?:  {
      __typename: "Question",
      id: string,
      text: string,
      topic: string,
      index?: number | null,
      formDefinitionID: string,
      categoryID: string,
      type?: QuestionType | null,
      scaleStart?: string | null,
      scaleMiddle?: string | null,
      scaleEnd?: string | null,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    knowledge?: number | null,
    motivation?: number | null,
    customScaleValue?: number | null,
    textValue?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteQuestionAnswerSubscriptionVariables = {
  owner?: string,
};

export type OnDeleteQuestionAnswerSubscription = {
  onDeleteQuestionAnswer?:  {
    __typename: "QuestionAnswer",
    id: string,
    userFormID: string,
    questionID: string,
    question?:  {
      __typename: "Question",
      id: string,
      text: string,
      topic: string,
      index?: number | null,
      formDefinitionID: string,
      categoryID: string,
      type?: QuestionType | null,
      scaleStart?: string | null,
      scaleMiddle?: string | null,
      scaleEnd?: string | null,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    knowledge?: number | null,
    motivation?: number | null,
    customScaleValue?: number | null,
    textValue?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateQuestionSubscription = {
  onCreateQuestion?:  {
    __typename: "Question",
    id: string,
    text: string,
    topic: string,
    index?: number | null,
    formDefinitionID: string,
    categoryID: string,
    category?:  {
      __typename: "Category",
      id: string,
      text: string,
      description?: string | null,
      index?: number | null,
      formDefinitionID: string,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    type?: QuestionType | null,
    scaleStart?: string | null,
    scaleMiddle?: string | null,
    scaleEnd?: string | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateQuestionSubscription = {
  onUpdateQuestion?:  {
    __typename: "Question",
    id: string,
    text: string,
    topic: string,
    index?: number | null,
    formDefinitionID: string,
    categoryID: string,
    category?:  {
      __typename: "Category",
      id: string,
      text: string,
      description?: string | null,
      index?: number | null,
      formDefinitionID: string,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    type?: QuestionType | null,
    scaleStart?: string | null,
    scaleMiddle?: string | null,
    scaleEnd?: string | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteQuestionSubscription = {
  onDeleteQuestion?:  {
    __typename: "Question",
    id: string,
    text: string,
    topic: string,
    index?: number | null,
    formDefinitionID: string,
    categoryID: string,
    category?:  {
      __typename: "Category",
      id: string,
      text: string,
      description?: string | null,
      index?: number | null,
      formDefinitionID: string,
      orgAdmins: string,
      organizationID: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    type?: QuestionType | null,
    scaleStart?: string | null,
    scaleMiddle?: string | null,
    scaleEnd?: string | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCategorySubscription = {
  onCreateCategory?:  {
    __typename: "Category",
    id: string,
    text: string,
    description?: string | null,
    index?: number | null,
    formDefinitionID: string,
    formDefinition?:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    } | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCategorySubscription = {
  onUpdateCategory?:  {
    __typename: "Category",
    id: string,
    text: string,
    description?: string | null,
    index?: number | null,
    formDefinitionID: string,
    formDefinition?:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    } | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCategorySubscription = {
  onDeleteCategory?:  {
    __typename: "Category",
    id: string,
    text: string,
    description?: string | null,
    index?: number | null,
    formDefinitionID: string,
    formDefinition?:  {
      __typename: "FormDefinition",
      id: string,
      label?: string | null,
      createdAt: string,
      sortKeyConstant: string,
      organizationID: string,
      orgAdmins: string,
      updatedAt: string,
    } | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      nextToken?: string | null,
    } | null,
    orgAdmins: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateGroupSubscription = {
  onCreateGroup?:  {
    __typename: "Group",
    id: string,
    groupLeaderUsername: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGroupSubscription = {
  onUpdateGroup?:  {
    __typename: "Group",
    id: string,
    groupLeaderUsername: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGroupSubscription = {
  onDeleteGroup?:  {
    __typename: "Group",
    id: string,
    groupLeaderUsername: string,
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgGroupLeaders: string,
    orgAdmins: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    groupID: string,
    group:  {
      __typename: "Group",
      id: string,
      groupLeaderUsername: string,
      organizationID: string,
      orgGroupLeaders: string,
      orgAdmins: string,
      createdAt: string,
      updatedAt: string,
    },
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    orgGroupLeaders: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    groupID: string,
    group:  {
      __typename: "Group",
      id: string,
      groupLeaderUsername: string,
      organizationID: string,
      orgGroupLeaders: string,
      orgAdmins: string,
      createdAt: string,
      updatedAt: string,
    },
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    orgGroupLeaders: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    groupID: string,
    group:  {
      __typename: "Group",
      id: string,
      groupLeaderUsername: string,
      organizationID: string,
      orgGroupLeaders: string,
      orgAdmins: string,
      createdAt: string,
      updatedAt: string,
    },
    organizationID: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      createdAt: string,
      owner?: string | null,
      orgname: string,
      identifierAttribute: string,
      updatedAt: string,
    } | null,
    orgAdmins: string,
    orgGroupLeaders: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};
