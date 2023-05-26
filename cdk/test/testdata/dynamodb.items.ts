// Users
export const testUserOla = {
  id: 'ola.nordmann@knowit.no',
  groupID: '123',
  organizationID: 'testorg',
  createdAt: '2023-01-01T10:00:00.605Z',
  updatedAt: '2023-01-01T10:00:00.605Z',
}

export const testUserKari = {
  id: 'kari.nordkvinne@knowit.no',
  groupID: '456',
  organizationID: 'myOrganization',
  createdAt: '2022-03-01T08:00:00.605Z',
  updatedAt: '2022-03-01T08:00:00.605Z',
}

export const testUsers = [testUserOla, testUserKari]

// UserForms
export const testUserOlaLastUserFormUpdatedAt = '2090-02-01T12:00:00.605Z'
export const userFormTestData = [
  {
    id: '0',
    owner: testUserOla.id,
    formDefinitionId: '0',
    createdAt: '2023-01-01T12:00:00.605Z',
    updatedAt: '2023-01-02T13:00:00.605Z',
  },
  {
    id: '1',
    owner: testUserOla.id,
    formDefinitionId: '1',
    createdAt: '2090-01-01T12:00:00.605Z',
    updatedAt: testUserOlaLastUserFormUpdatedAt,
  },
  {
    id: '2',
    owner: testUserKari.id,
    formDefinitionId: '2',
    createdAt: '2023-02-18T11:00:00.605Z',
    updatedAt: '2023-02-19T05:00:00.605Z',
  },
  {
    id: '3',
    owner: testUserKari.id,
    formDefinitionId: '0',
    createdAt: '2023-02-18T11:00:00.605Z',
    updatedAt: '2023-02-19T05:00:00.605Z',
  },
]

// QuestionAnswers
export const questionAnswerTestData = [
  {
    id: '0',
    owner: testUserOla.id,
    userFormID: '0',
    questionID: '0',
    knowledge: '3',
    motivation: '4',
    createdAt: '2023-01-01T12:00:00.605Z',
    updatedAt: '2023-01-02T13:00:00.605Z',
  },
  {
    id: '1',
    owner: testUserOla.id,
    userFormID: '0',
    questionID: '1',
    knowledge: '2',
    motivation: '5',
    createdAt: '2023-01-01T12:10:00.605Z',
    updatedAt: '2023-01-02T12:11:00.605Z',
  },
  {
    id: '2',
    owner: testUserOla.id,
    userFormID: '1',
    questionID: '0',
    knowledge: '2.5',
    motivation: '3.3',
    createdAt: '2023-02-01T12:10:00.605Z',
    updatedAt: '2023-02-01T12:10:00.605Z',
  },
  {
    id: '3',
    owner: testUserKari.id,
    userFormID: '2',
    questionID: '0',
    knowledge: '1.2',
    motivation: '5.0',
    createdAt: '2023-02-01T12:10:00.605Z',
    updatedAt: '2023-02-01T12:10:00.605Z',
  },
  {
    id: '4',
    owner: testUserKari.id,
    userFormID: '2',
    questionID: '0',
    knowledge: '1',
    motivation: '1',
    createdAt: '2023-01-01T12:00:00.605Z',
    updatedAt: '2023-01-02T13:00:00.605Z',
  },
  {
    id: '5',
    owner: testUserKari.id,
    userFormID: '3',
    questionID: '1',
    knowledge: '1',
    motivation: '1',
    createdAt: '2023-01-01T12:00:00.605Z',
    updatedAt: '2023-01-02T13:00:00.605Z',
  },
]

export const olaUserFormsInTestData = userFormTestData.filter(
  userForm => userForm.owner === testUserOla.id
)

export const kariUserFormsInTestData = userFormTestData.filter(
  userForm => userForm.owner === testUserKari.id
)

export const olaQuestionAnswersInTestData = questionAnswerTestData.filter(
  qa => qa.owner === testUserOla.id
)
