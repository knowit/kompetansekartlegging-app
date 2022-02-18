import {
    ModelInit,
    MutableModel,
    PersistentModelConstructor,
} from "@aws-amplify/datastore";

export declare class QuestionAnswer {
    readonly id: string;
    readonly userFormID: string;
    readonly question: Question;
    readonly knowledge: number;
    readonly motivation: number;
    readonly owner?: string;
    constructor(init: ModelInit<QuestionAnswer>);
    static copyOf(
        source: QuestionAnswer,
        mutator: (
            draft: MutableModel<QuestionAnswer>
        ) => MutableModel<QuestionAnswer> | void
    ): QuestionAnswer;
}

export declare class Question {
    readonly id: string;
    readonly text: string;
    readonly topic: string;
    readonly category: string;
    readonly formDefinitions?: QuestionFormDefinitionConnection[];
    constructor(init: ModelInit<Question>);
    static copyOf(
        source: Question,
        mutator: (
            draft: MutableModel<Question>
        ) => MutableModel<Question> | void
    ): Question;
}

export declare class QuestionFormDefinitionConnection {
    readonly id: string;
    readonly question: Question;
    readonly formDefinition: FormDefinition;
    constructor(init: ModelInit<QuestionFormDefinitionConnection>);
    static copyOf(
        source: QuestionFormDefinitionConnection,
        mutator: (
            draft: MutableModel<QuestionFormDefinitionConnection>
        ) => MutableModel<QuestionFormDefinitionConnection> | void
    ): QuestionFormDefinitionConnection;
}

export declare class FormDefinition {
    readonly id: string;
    readonly questions?: QuestionFormDefinitionConnection[];
    constructor(init: ModelInit<FormDefinition>);
    static copyOf(
        source: FormDefinition,
        mutator: (
            draft: MutableModel<FormDefinition>
        ) => MutableModel<FormDefinition> | void
    ): FormDefinition;
}

export declare class UserForm {
    readonly id: string;
    readonly questionAnswers?: QuestionAnswer[];
    readonly formDefinition: FormDefinition;
    readonly owner?: string;
    constructor(init: ModelInit<UserForm>);
    static copyOf(
        source: UserForm,
        mutator: (
            draft: MutableModel<UserForm>
        ) => MutableModel<UserForm> | void
    ): UserForm;
}
