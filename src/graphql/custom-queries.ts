import { ModelSortDirection } from "../API";

export const listUserFormsWithAnswers = /* GraphQL */ `
    query ListUserFormsWithAnswers(
        $filter: ModelUserFormFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listUserForms(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                createdAt
                formDefinitionID
                questionAnswers {
                    items {
                        id
                        knowledge
                        motivation
                        createdAt
                        question {
                            id
                            category {
                                text
                                id
                            }
                        }
                    }
                }
            }
            nextToken
        }
    }
`;

export const createFormDefinitionInputConsts = {
    input: {
        sortKeyConstant: "formDefinitionConstant",
    },
};

export const formByCreatedAtInputConsts = {
    limit: 1,
    sortKeyConstant: "formDefinitionConstant",
    sortDirection: ModelSortDirection.DESC,
};

export const formByCreatedAtt = /* GraphQL */ `
    query FormByCreatedAtt(
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
                createdAt
                questions {
                    items {
                        category {
                            id
                            text
                            description
                            index
                        }
                        index
                        id
                        createdAt
                        text
                        topic
                    }
                }
            }
            nextToken
        }
    }
`;

export const formByCreatedAtPaginated = /* GraphQL */ `
    query FormByCreatedAtPaginated(
        $sortKeyConstant: String
        $createdAt: ModelStringKeyConditionInput
        $sortDirection: ModelSortDirection
        $filter: ModelFormDefinitionFilterInput
        $limit: Int
        $nextToken: String
        $nextFormToken: String
    ) {
        formByCreatedAt(
            sortKeyConstant: $sortKeyConstant
            createdAt: $createdAt
            sortDirection: $sortDirection
            filter: $filter
            limit: $limit
            nextToken: $nextFormToken
        ) {
            items {
                id
                createdAt
                questions(nextToken: $nextToken) {
                    items {
                        category {
                            id
                            text
                            description
                            index
                        }
                        index
                        id
                        createdAt
                        text
                        topic

                        type
                        scaleStart
                        scaleMiddle
                        scaleEnd
                    }
                    nextToken
                }
            }
            nextToken
        }
    }
`;

export const userFormByCreatedAtInputConsts = {
    limit: 1,
    sortDirection: ModelSortDirection.DESC,
};

export const customUserFormByCreatedAt = /* GraphQL */ `
    query CustomUserFormByCreatedAt(
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
        ) {
            items {
                id
                formDefinitionID
                questionAnswers(nextToken: $nextToken) {
                    items {
                        id
                        knowledge
                        motivation
                        updatedAt
                        customScaleValue
                        question {
                            id
                            text
                            topic
                            type
                            category {
                                id
                                text
                                description
                                index
                            }
                        }
                    }
                    nextToken
                }
            }
        }
    }
`;

export const batchCreateQuestionAnswer2 = /* GraphQL */ `
    mutation BatchCreateQuestionAnswer2(
        $input: [CreateQuestionAnswerInput]
        $organizationID: String
    ) {
        batchCreateQuestionAnswer(
            input: $input
            organizationID: $organizationID
        ) {
            status
            error
            failedInputs {
                id
                userFormID
                questionID
                knowledge
                motivation
                formDefinitionID
            }
        }
    }
`;
