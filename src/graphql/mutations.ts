/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const batchCreateQuestionAnswer = /* GraphQL */ `
  mutation BatchCreateQuestionAnswer(
    $input: [CreateQuestionAnswerInput]
    $organizationID: String
  ) {
    batchCreateQuestionAnswer(input: $input, organizationID: $organizationID) {
      status
      error
      failedInputs {
        id
        userFormID
        questionID
        knowledge
        motivation
        customScaleValue
        formDefinitionID
      }
    }
  }
`;
export const createApiKeyPermission = /* GraphQL */ `
  mutation CreateApiKeyPermission(
    $input: CreateAPIKeyPermissionInput!
    $condition: ModelAPIKeyPermissionConditionInput
  ) {
    createAPIKeyPermission(input: $input, condition: $condition) {
      id
      APIKeyHashed
      organizationID
      createdAt
      updatedAt
    }
  }
`;
export const updateApiKeyPermission = /* GraphQL */ `
  mutation UpdateApiKeyPermission(
    $input: UpdateAPIKeyPermissionInput!
    $condition: ModelAPIKeyPermissionConditionInput
  ) {
    updateAPIKeyPermission(input: $input, condition: $condition) {
      id
      APIKeyHashed
      organizationID
      createdAt
      updatedAt
    }
  }
`;
export const deleteApiKeyPermission = /* GraphQL */ `
  mutation DeleteApiKeyPermission(
    $input: DeleteAPIKeyPermissionInput!
    $condition: ModelAPIKeyPermissionConditionInput
  ) {
    deleteAPIKeyPermission(input: $input, condition: $condition) {
      id
      APIKeyHashed
      organizationID
      createdAt
      updatedAt
    }
  }
`;
export const createOrganization = /* GraphQL */ `
  mutation CreateOrganization(
    $input: CreateOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    createOrganization(input: $input, condition: $condition) {
      id
      createdAt
      owner
      orgname
      identifierAttribute
      updatedAt
    }
  }
`;
export const updateOrganization = /* GraphQL */ `
  mutation UpdateOrganization(
    $input: UpdateOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    updateOrganization(input: $input, condition: $condition) {
      id
      createdAt
      owner
      orgname
      identifierAttribute
      updatedAt
    }
  }
`;
export const deleteOrganization = /* GraphQL */ `
  mutation DeleteOrganization(
    $input: DeleteOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    deleteOrganization(input: $input, condition: $condition) {
      id
      createdAt
      owner
      orgname
      identifierAttribute
      updatedAt
    }
  }
`;
export const createFormDefinition = /* GraphQL */ `
  mutation CreateFormDefinition(
    $input: CreateFormDefinitionInput!
    $condition: ModelFormDefinitionConditionInput
  ) {
    createFormDefinition(input: $input, condition: $condition) {
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
export const updateFormDefinition = /* GraphQL */ `
  mutation UpdateFormDefinition(
    $input: UpdateFormDefinitionInput!
    $condition: ModelFormDefinitionConditionInput
  ) {
    updateFormDefinition(input: $input, condition: $condition) {
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
export const deleteFormDefinition = /* GraphQL */ `
  mutation DeleteFormDefinition(
    $input: DeleteFormDefinitionInput!
    $condition: ModelFormDefinitionConditionInput
  ) {
    deleteFormDefinition(input: $input, condition: $condition) {
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
export const createUserForm = /* GraphQL */ `
  mutation CreateUserForm(
    $input: CreateUserFormInput!
    $condition: ModelUserFormConditionInput
  ) {
    createUserForm(input: $input, condition: $condition) {
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
export const updateUserForm = /* GraphQL */ `
  mutation UpdateUserForm(
    $input: UpdateUserFormInput!
    $condition: ModelUserFormConditionInput
  ) {
    updateUserForm(input: $input, condition: $condition) {
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
export const deleteUserForm = /* GraphQL */ `
  mutation DeleteUserForm(
    $input: DeleteUserFormInput!
    $condition: ModelUserFormConditionInput
  ) {
    deleteUserForm(input: $input, condition: $condition) {
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
export const createQuestionAnswer = /* GraphQL */ `
  mutation CreateQuestionAnswer(
    $input: CreateQuestionAnswerInput!
    $condition: ModelQuestionAnswerConditionInput
  ) {
    createQuestionAnswer(input: $input, condition: $condition) {
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
export const updateQuestionAnswer = /* GraphQL */ `
  mutation UpdateQuestionAnswer(
    $input: UpdateQuestionAnswerInput!
    $condition: ModelQuestionAnswerConditionInput
  ) {
    updateQuestionAnswer(input: $input, condition: $condition) {
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
export const deleteQuestionAnswer = /* GraphQL */ `
  mutation DeleteQuestionAnswer(
    $input: DeleteQuestionAnswerInput!
    $condition: ModelQuestionAnswerConditionInput
  ) {
    deleteQuestionAnswer(input: $input, condition: $condition) {
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
export const createQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
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
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion(
    $input: UpdateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    updateQuestion(input: $input, condition: $condition) {
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
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion(
    $input: DeleteQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    deleteQuestion(input: $input, condition: $condition) {
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
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
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
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
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
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
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
export const createGroup = /* GraphQL */ `
  mutation CreateGroup(
    $input: CreateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    createGroup(input: $input, condition: $condition) {
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
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $input: UpdateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    updateGroup(input: $input, condition: $condition) {
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
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup(
    $input: DeleteGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    deleteGroup(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
