/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateApiKeyPermission = /* GraphQL */ `
  subscription OnCreateApiKeyPermission {
    onCreateAPIKeyPermission {
      id
      APIKeyHashed
      organizationID
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateApiKeyPermission = /* GraphQL */ `
  subscription OnUpdateApiKeyPermission {
    onUpdateAPIKeyPermission {
      id
      APIKeyHashed
      organizationID
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteApiKeyPermission = /* GraphQL */ `
  subscription OnDeleteApiKeyPermission {
    onDeleteAPIKeyPermission {
      id
      APIKeyHashed
      organizationID
      createdAt
      updatedAt
    }
  }
`;
export const onCreateOrganization = /* GraphQL */ `
  subscription OnCreateOrganization {
    onCreateOrganization {
      id
      createdAt
      owner
      orgname
      identifierAttribute
      updatedAt
    }
  }
`;
export const onUpdateOrganization = /* GraphQL */ `
  subscription OnUpdateOrganization {
    onUpdateOrganization {
      id
      createdAt
      owner
      orgname
      identifierAttribute
      updatedAt
    }
  }
`;
export const onDeleteOrganization = /* GraphQL */ `
  subscription OnDeleteOrganization {
    onDeleteOrganization {
      id
      createdAt
      owner
      orgname
      identifierAttribute
      updatedAt
    }
  }
`;
export const onCreateFormDefinition = /* GraphQL */ `
  subscription OnCreateFormDefinition {
    onCreateFormDefinition {
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
export const onUpdateFormDefinition = /* GraphQL */ `
  subscription OnUpdateFormDefinition {
    onUpdateFormDefinition {
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
export const onDeleteFormDefinition = /* GraphQL */ `
  subscription OnDeleteFormDefinition {
    onDeleteFormDefinition {
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
export const onCreateUserForm = /* GraphQL */ `
  subscription OnCreateUserForm($owner: String!) {
    onCreateUserForm(owner: $owner) {
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
export const onUpdateUserForm = /* GraphQL */ `
  subscription OnUpdateUserForm($owner: String!) {
    onUpdateUserForm(owner: $owner) {
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
export const onDeleteUserForm = /* GraphQL */ `
  subscription OnDeleteUserForm($owner: String!) {
    onDeleteUserForm(owner: $owner) {
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
export const onCreateQuestionAnswer = /* GraphQL */ `
  subscription OnCreateQuestionAnswer($owner: String!) {
    onCreateQuestionAnswer(owner: $owner) {
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
export const onUpdateQuestionAnswer = /* GraphQL */ `
  subscription OnUpdateQuestionAnswer($owner: String!) {
    onUpdateQuestionAnswer(owner: $owner) {
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
export const onDeleteQuestionAnswer = /* GraphQL */ `
  subscription OnDeleteQuestionAnswer($owner: String!) {
    onDeleteQuestionAnswer(owner: $owner) {
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
export const onCreateQuestion = /* GraphQL */ `
  subscription OnCreateQuestion {
    onCreateQuestion {
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
export const onUpdateQuestion = /* GraphQL */ `
  subscription OnUpdateQuestion {
    onUpdateQuestion {
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
export const onDeleteQuestion = /* GraphQL */ `
  subscription OnDeleteQuestion {
    onDeleteQuestion {
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
export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory {
    onCreateCategory {
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
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory {
    onUpdateCategory {
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
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory {
    onDeleteCategory {
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
export const onCreateGroup = /* GraphQL */ `
  subscription OnCreateGroup {
    onCreateGroup {
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
export const onUpdateGroup = /* GraphQL */ `
  subscription OnUpdateGroup {
    onUpdateGroup {
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
export const onDeleteGroup = /* GraphQL */ `
  subscription OnDeleteGroup {
    onDeleteGroup {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
