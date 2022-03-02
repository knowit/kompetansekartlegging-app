export const schema = {
    models: {
        QuestionAnswer: {
            name: "QuestionAnswer",
            fields: {
                id: {
                    name: "id",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                userFormID: {
                    name: "userFormID",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                question: {
                    name: "question",
                    isArray: false,
                    type: {
                        model: "Question",
                    },
                    isRequired: true,
                    attributes: [],
                    association: {
                        connectionType: "BELONGS_TO",
                        targetName: "questionAnswerQuestionId",
                    },
                },
                knowledge: {
                    name: "knowledge",
                    isArray: false,
                    type: "Float",
                    isRequired: true,
                    attributes: [],
                },
                motivation: {
                    name: "motivation",
                    isArray: false,
                    type: "Float",
                    isRequired: true,
                    attributes: [],
                },
                owner: {
                    name: "owner",
                    isArray: false,
                    type: "String",
                    isRequired: false,
                    attributes: [],
                },
            },
            syncable: true,
            pluralName: "QuestionAnswers",
            attributes: [
                {
                    type: "model",
                    properties: {},
                },
                {
                    type: "key",
                    properties: {
                        name: "byUserForm",
                        fields: ["userFormID"],
                    },
                },
                {
                    type: "auth",
                    properties: {
                        rules: [
                            {
                                provider: "userPools",
                                ownerField: "owner",
                                allow: "owner",
                                identityClaim: "cognito:username",
                                operations: [
                                    "create",
                                    "update",
                                    "delete",
                                    "read",
                                ],
                            },
                        ],
                    },
                },
            ],
        },
        Question: {
            name: "Question",
            fields: {
                id: {
                    name: "id",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                text: {
                    name: "text",
                    isArray: false,
                    type: "String",
                    isRequired: true,
                    attributes: [],
                },
                topic: {
                    name: "topic",
                    isArray: false,
                    type: "String",
                    isRequired: true,
                    attributes: [],
                },
                category: {
                    name: "category",
                    isArray: false,
                    type: "String",
                    isRequired: true,
                    attributes: [],
                },
                formDefinitions: {
                    name: "formDefinitions",
                    isArray: true,
                    type: {
                        model: "QuestionFormDefinitionConnection",
                    },
                    isRequired: false,
                    attributes: [],
                    isArrayNullable: true,
                    association: {
                        connectionType: "HAS_MANY",
                        associatedWith: "question",
                    },
                },
            },
            syncable: true,
            pluralName: "Questions",
            attributes: [
                {
                    type: "model",
                    properties: {},
                },
            ],
        },
        QuestionFormDefinitionConnection: {
            name: "QuestionFormDefinitionConnection",
            fields: {
                id: {
                    name: "id",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                question: {
                    name: "question",
                    isArray: false,
                    type: {
                        model: "Question",
                    },
                    isRequired: true,
                    attributes: [],
                    association: {
                        connectionType: "BELONGS_TO",
                        targetName: "questionID",
                    },
                },
                formDefinition: {
                    name: "formDefinition",
                    isArray: false,
                    type: {
                        model: "FormDefinition",
                    },
                    isRequired: true,
                    attributes: [],
                    association: {
                        connectionType: "BELONGS_TO",
                        targetName: "formDefinitionID",
                    },
                },
            },
            syncable: true,
            pluralName: "QuestionFormDefinitionConnections",
            attributes: [
                {
                    type: "model",
                    properties: {
                        queries: null,
                    },
                },
                {
                    type: "key",
                    properties: {
                        name: "connectedFormDefinition",
                        fields: ["formDefinitionID", "questionID"],
                    },
                },
                {
                    type: "key",
                    properties: {
                        name: "connectedQuestion",
                        fields: ["questionID", "formDefinitionID"],
                    },
                },
            ],
        },
        FormDefinition: {
            name: "FormDefinition",
            fields: {
                id: {
                    name: "id",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                questions: {
                    name: "questions",
                    isArray: true,
                    type: {
                        model: "QuestionFormDefinitionConnection",
                    },
                    isRequired: false,
                    attributes: [],
                    isArrayNullable: true,
                    association: {
                        connectionType: "HAS_MANY",
                        associatedWith: "formDefinition",
                    },
                },
            },
            syncable: true,
            pluralName: "FormDefinitions",
            attributes: [
                {
                    type: "model",
                    properties: {},
                },
            ],
        },
        UserForm: {
            name: "UserForm",
            fields: {
                id: {
                    name: "id",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                questionAnswers: {
                    name: "questionAnswers",
                    isArray: true,
                    type: {
                        model: "QuestionAnswer",
                    },
                    isRequired: false,
                    attributes: [],
                    isArrayNullable: true,
                    association: {
                        connectionType: "HAS_MANY",
                        associatedWith: "userFormID",
                    },
                },
                formDefinition: {
                    name: "formDefinition",
                    isArray: false,
                    type: {
                        model: "FormDefinition",
                    },
                    isRequired: true,
                    attributes: [],
                    association: {
                        connectionType: "BELONGS_TO",
                        targetName: "userFormFormDefinitionId",
                    },
                },
                owner: {
                    name: "owner",
                    isArray: false,
                    type: "String",
                    isRequired: false,
                    attributes: [],
                },
            },
            syncable: true,
            pluralName: "UserForms",
            attributes: [
                {
                    type: "model",
                    properties: {},
                },
                {
                    type: "auth",
                    properties: {
                        rules: [
                            {
                                provider: "userPools",
                                ownerField: "owner",
                                allow: "owner",
                                identityClaim: "cognito:username",
                                operations: [
                                    "create",
                                    "update",
                                    "delete",
                                    "read",
                                ],
                            },
                        ],
                    },
                },
            ],
        },
    },
    enums: {},
    nonModels: {},
    version: "68ee6d3166a5de1c5cb0831a8d312639",
};
