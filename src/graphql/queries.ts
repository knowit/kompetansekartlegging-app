/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getApiKeyPermission = /* GraphQL */ `
  query GetApiKeyPermission($id: ID!) {
    getAPIKeyPermission(id: $id) {
      id
      APIKeyHashed
      organizationID
      createdAt
      updatedAt
    }
  }
`;
export const listApiKeyPermissions = /* GraphQL */ `
  query ListApiKeyPermissions(
    $filter: ModelAPIKeyPermissionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAPIKeyPermissions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        APIKeyHashed
        organizationID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOrganization = /* GraphQL */ `
  query GetOrganization($id: ID!) {
    getOrganization(id: $id) {
      id
      createdAt
      owner
      orgname
      identifierAttribute
      updatedAt
    }
  }
`;
export const listOrganizations = /* GraphQL */ `
  query ListOrganizations(
    $filter: ModelOrganizationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrganizations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        owner
        orgname
        identifierAttribute
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFormDefinition = /* GraphQL */ `
  query GetFormDefinition($id: ID!) {
    getFormDefinition(id: $id) {
      id
      label
      createdAt
      sortKeyConstant
      questions {
        nextToken
      }
      organizationID
      organization {
        id
        createdAt
        owner
        orgname
        identifierAttribute
        updatedAt
      }
      orgAdmins
      updatedAt
    }
  }
`;
export const listFormDefinitions = /* GraphQL */ `
  query ListFormDefinitions(
    $filter: ModelFormDefinitionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFormDefinitions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        label
        createdAt
        sortKeyConstant
        organizationID
        orgAdmins
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUserForm = /* GraphQL */ `
  query GetUserForm($id: ID!) {
    getUserForm(id: $id) {
      id
      createdAt
      owner
      formDefinitionID
      questionAnswers {
        nextToken
      }
      formDefinition {
        id
        label
        createdAt
        sortKeyConstant
        organizationID
        orgAdmins
        updatedAt
      }
      orgGroupLeaders
      orgAdmins
      updatedAt
    }
  }
`;
export const listUserForms = /* GraphQL */ `
  query ListUserForms(
    $filter: ModelUserFormFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserForms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        owner
        formDefinitionID
        orgGroupLeaders
        orgAdmins
        updatedAt
      }
      nextToken
    }
  }
`;
export const getQuestionAnswer = /* GraphQL */ `
  query GetQuestionAnswer($id: ID!) {
    getQuestionAnswer(id: $id) {
      id
      userFormID
      questionID
      question {
        id
        text
        topic
        index
        formDefinitionID
        categoryID
        type
        scaleStart
        scaleMiddle
        scaleEnd
        orgAdmins
        organizationID
        createdAt
        updatedAt
      }
      orgGroupLeaders
      orgAdmins
      knowledge
      motivation
      customScaleValue
      textValue
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listQuestionAnswers = /* GraphQL */ `
  query ListQuestionAnswers(
    $filter: ModelQuestionAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionAnswers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userFormID
        questionID
        orgGroupLeaders
        orgAdmins
        knowledge
        motivation
        customScaleValue
        textValue
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      text
      topic
      index
      formDefinitionID
      categoryID
      category {
        id
        text
        description
        index
        formDefinitionID
        orgAdmins
        organizationID
        createdAt
        updatedAt
      }
      type
      scaleStart
      scaleMiddle
      scaleEnd
      orgAdmins
      organizationID
      organization {
        id
        createdAt
        owner
        orgname
        identifierAttribute
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listQuestions = /* GraphQL */ `
  query ListQuestions(
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        topic
        index
        formDefinitionID
        categoryID
        type
        scaleStart
        scaleMiddle
        scaleEnd
        orgAdmins
        organizationID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
      id
      text
      description
      index
      formDefinitionID
      formDefinition {
        id
        label
        createdAt
        sortKeyConstant
        organizationID
        orgAdmins
        updatedAt
      }
      questions {
        nextToken
      }
      orgAdmins
      organizationID
      organization {
        id
        createdAt
        owner
        orgname
        identifierAttribute
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listCategorys = /* GraphQL */ `
  query ListCategorys(
    $filter: ModelCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategorys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        description
        index
        formDefinitionID
        orgAdmins
        organizationID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getGroup = /* GraphQL */ `
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      groupLeaderUsername
      organizationID
      organization {
        id
        createdAt
        owner
        orgname
        identifierAttribute
        updatedAt
      }
      orgGroupLeaders
      orgAdmins
      createdAt
      updatedAt
    }
  }
`;
export const listGroups = /* GraphQL */ `
  query ListGroups(
    $filter: ModelGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        groupLeaderUsername
        organizationID
        orgGroupLeaders
        orgAdmins
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      groupID
      group {
        id
        groupLeaderUsername
        organizationID
        orgGroupLeaders
        orgAdmins
        createdAt
        updatedAt
      }
      organizationID
      organization {
        id
        createdAt
        owner
        orgname
        identifierAttribute
        updatedAt
      }
      orgAdmins
      orgGroupLeaders
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        groupID
        organizationID
        orgAdmins
        orgGroupLeaders
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const organizationByApiKeyHashed = /* GraphQL */ `
  query OrganizationByApiKeyHashed(
    $APIKeyHashed: String
    $sortDirection: ModelSortDirection
    $filter: ModelAPIKeyPermissionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    organizationByAPIKeyHashed(
      APIKeyHashed: $APIKeyHashed
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        APIKeyHashed
        organizationID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const organizationByIdentifierAttribute = /* GraphQL */ `
  query OrganizationByIdentifierAttribute(
    $identifierAttribute: String
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    organizationByIdentifierAttribute(
      identifierAttribute: $identifierAttribute
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdAt
        owner
        orgname
        identifierAttribute
        updatedAt
      }
      nextToken
    }
  }
`;
export const formByCreatedAt = /* GraphQL */ `
  query FormByCreatedAt(
    $sortKeyConstant: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelFormDefinitionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    formByCreatedAt(
      sortKeyConstant: $sortKeyConstant
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        label
        createdAt
        sortKeyConstant
        organizationID
        orgAdmins
        updatedAt
      }
      nextToken
    }
  }
`;
export const formByOrganizationByCreatedAt = /* GraphQL */ `
  query FormByOrganizationByCreatedAt(
    $organizationID: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelFormDefinitionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    formByOrganizationByCreatedAt(
      organizationID: $organizationID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        label
        createdAt
        sortKeyConstant
        organizationID
        orgAdmins
        updatedAt
      }
      nextToken
    }
  }
`;
export const formDefinitionByOrganizationId = /* GraphQL */ `
  query FormDefinitionByOrganizationId(
    $organizationID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelFormDefinitionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    formDefinitionByOrganizationID(
      organizationID: $organizationID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        label
        createdAt
        sortKeyConstant
        organizationID
        orgAdmins
        updatedAt
      }
      nextToken
    }
  }
`;
export const userFormByCreatedAt = /* GraphQL */ `
  query UserFormByCreatedAt(
    $owner: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFormFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userFormByCreatedAt(
      owner: $owner
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdAt
        owner
        formDefinitionID
        orgGroupLeaders
        orgAdmins
        updatedAt
      }
      nextToken
    }
  }
`;
export const questionsByFormDefinition = /* GraphQL */ `
  query QuestionsByFormDefinition(
    $formDefinitionID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    questionsByFormDefinition(
      formDefinitionID: $formDefinitionID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        text
        topic
        index
        formDefinitionID
        categoryID
        type
        scaleStart
        scaleMiddle
        scaleEnd
        orgAdmins
        organizationID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const questionsByCategory = /* GraphQL */ `
  query QuestionsByCategory(
    $categoryID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    questionsByCategory(
      categoryID: $categoryID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        text
        topic
        index
        formDefinitionID
        categoryID
        type
        scaleStart
        scaleMiddle
        scaleEnd
        orgAdmins
        organizationID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const categoriesByFormDefinition = /* GraphQL */ `
  query CategoriesByFormDefinition(
    $formDefinitionID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    categoriesByFormDefinition(
      formDefinitionID: $formDefinitionID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        text
        description
        index
        formDefinitionID
        orgAdmins
        organizationID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const usersByGroup = /* GraphQL */ `
  query UsersByGroup(
    $groupID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByGroup(
      groupID: $groupID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        groupID
        organizationID
        orgAdmins
        orgGroupLeaders
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
