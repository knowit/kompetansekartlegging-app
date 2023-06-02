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

export const testUserAlex = {
  id: 'alex.nordperson@knowit.no',
  groupID: '789',
  organizationID: 'myOrganization',
  createdAt: '2021-03-01T08:00:00.605Z',
  updatedAt: '2021-03-01T08:00:00.605Z',
}

export const testUsers = [testUserOla, testUserKari, testUserAlex]

// UserForms
export const testUserOlaLastUserFormUpdatedAt = '2090-02-01T12:00:00.605Z'

export const olaUserFormsInTestData = [
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
]

export const kariUserFormsInTestData = [
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

const alexUserForms = []
const idStart = olaUserFormsInTestData.length + kariUserFormsInTestData.length
// Generate 25 forms and add them to the list
for (let i = 0; i < 51; i++) {
  const object = {
    id: String(i + idStart),
    owner: testUserAlex.id,
    formDefinitionId: '2',
    createdAt: '2023-02-18T11:00:00.605Z',
    updatedAt: '2023-02-19T05:00:00.605Z',
  }
  alexUserForms.push(object)
}

export const alexUserFormsInTestData = alexUserForms

export const userFormTestData = [
  ...olaUserFormsInTestData,
  ...kariUserFormsInTestData,
  ...alexUserFormsInTestData,
]

// QuestionAnswers

export const olaQuestionAnswersInTestData = [
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
]

export const kariQuestionAnswersInTestData = [
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

const alexQuestionAnswers = []
const idStart2 = olaQuestionAnswersInTestData.length + kariQuestionAnswersInTestData.length
// Generate 25 forms and add them to the list
for (let i = 0; i < 51; i++) {
  const object = {
    id: String(i + idStart2),
    owner: testUserAlex.id,
    userFormID: String(idStart + 25),
    questionID: String(i),
    knowledge: '1',
    motivation: '1',
    createdAt: '2023-02-18T11:00:00.605Z',
    updatedAt: '2023-02-19T05:00:00.605Z',
  }
  alexQuestionAnswers.push(object)
}

const alexQuestionAnswersInTestData = alexQuestionAnswers

export const questionAnswerTestData = [
  ...olaQuestionAnswersInTestData,
  ...kariQuestionAnswersInTestData,
  ...alexQuestionAnswersInTestData
]
