
export const testDataUser = {
    id: 'ola.nordmann@knowit.no',
    groupID: '123',
    organizationID: 'testorg'
}

export const userTestData = [
    {
        id: testDataUser['id'],
        groupId: testDataUser['groupID'],
        organizationID: testDataUser['organizationID'],
        createdAt: '2023-01-01T10:00:00.605Z',
        updatedAt: '2023-01-01T10:00:00.605Z',
    }
]

export const userFormTestData = [
    {
        id: '0',
        owner: testDataUser['id'],
        formDefinitionId: '0',
        createdAt: '2023-01-01T12:00:00.605Z',
        updatedAt: '2023-01-02T13:00:00.605Z',
    },
    {
        id: '1',
        owner: testDataUser['id'],
        formDefinitionId: '1',
        createdAt: '2023-02-01T12:00:00.605Z',
        updatedAt: '2023-02-01T12:00:00.605Z',
    }
]

export const questionAnswerTestData = [
    {
        id: '0',
        owner: testDataUser['id'],
        userFormID: '0',
        questionID: '0',
        knowledge: '3',
        motivation: '4',
        createdAt: '2023-01-01T12:00:00.605Z',
        updatedAt: '2023-01-02T13:00:00.605Z',
    },
    {
        id: '1',
        owner: testDataUser['id'],
        userFormID: '0',
        questionID: '1',
        knowledge: '2',
        motivation: '5',
        createdAt: '2023-01-01T12:10:00.605Z',
        updatedAt: '2023-01-02T12:11:00.605Z',
    },
    {
        id: '2',
        owner: testDataUser['id'],
        userFormID: '1',
        questionID: '0',
        knowledge: '2.5',
        motivation: '3.3',
        createdAt: '2023-02-01T12:10:00.605Z',
        updatedAt: '2023-02-01T12:10:00.605Z',
    }
]