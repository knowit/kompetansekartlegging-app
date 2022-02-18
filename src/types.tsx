import { QuestionType } from "./API";
import { MenuButton } from "./components/Content";
import { AlertType } from "./components/AlertNotification";
import { Dispatch, SetStateAction } from "react";
import { OverviewType } from "./components/TypedOverviewChart";


export interface UserState {
    isSignedIn: boolean
    organizationID: string,
    email: string,
    name: string,
    userName: string,
    organizationName: string
    picture: string,
    roles: UserRole[]
}


export enum Panel {
    Overview,
    MyAnswers,
    GroupLeader,
    Admin,
    SuperAdmin,
    ScaleDescription,
    Other,
    None,
}

export type AnswerData = {
    questionId: string;
    topic: string;
    category: string;
    knowledge: number;
    motivation: number;
    updatedAt: number;
    index: number;
};

export type Answers = {
    [key: string]: AnswerData;
};

export type Question = {
    id: string;
    createdAt: string;
    text: string;
    topic: string;
    index: number;
    type: QuestionType;
    scaleStart: string | undefined;
    scaleMiddle: string | undefined;
    scaleEnd: string | undefined;
    category: {
        id: string;
        text: string;
        description: string | undefined;
        index: number | undefined;
    };
};

export type QuestionAnswer = {
    knowledge: number;
    motivation: number;
    customScaleValue: number;
    updatedAt: number;
    question: Question;
};

export type AggregatedAnswer = {
    category: String;
    totalAnswerValue: number;
    numberOfAnswerValues: number;
    answerAverage: number;
    totalMotivationValue: number;
    numberOfMotivationValues: number;
    motivationAverage: number;
};

export type CalculatedAnswer = {
    category: string;
    totalKnowledgeValue: number;
    numberOfKnowledgeValues: number;
    knowledgeAverage: number;
    totalMotivationValue: number;
    numberOfMotivationValues: number;
    motivationAverage: number;
};

export type CalculationData = {
    questionIds: string[];
    category: string;
    knowledgeCount: number;
    knowledgeTotal: number;
    motivationCount: number;
    motivationTotal: number;
};

export type ResultData = {
    category: string;
    aggKnowledge: number;
    aggMotivation: number;
    aggCustomScale: number;
};

export type AnsweredQuestion = {
    question: Question;
    answer: number;
    motivation: number;
};

export type TopicScoreWithIcon = {
    topic: string;
    score: number;
    icon: number;
};

export type FormDefinitionWithQuestions = {
    data: {
        getFormDefinition: {
            id: String;
            questions: {
                items: [Question];
            };
        };
    };
};

export type CreateQuestionAnswerResult = {
    batchCreateQuestionAnswer: {
        status: string;
        error: string;
        failedInputs: [
            {
                id: string;
                userFormID: string;
                questionID: string;
                knowledge: number;
                motivation: number;
                environmentID: string;
                formDefinitionID: string;
            }
        ];
    };
};

export type Category = {
    id: string;
    text: string;
    description: string;
    createdAt: string;
    index: number;
};

export type FormDefinition = {
    id: String;
    createdAt: string;
    questions: {
        items: Question[];
    };
};

export type FormDefinitionByCreatedAt = {
    formByCreatedAt: {
        nextToken: string;
        items: [FormDefinition];
    };
};

export type FormDefinitionByCreatedAtPaginated = {
    formByCreatedAt: {
        items: [FormDefinitionPaginated];
    };
};

export type FormDefinitionPaginated =
    | {
          id: String;
          createdAt: string;
          questions: {
              items: [Question];
              nextToken: string;
          };
      }
    | undefined;

export type UserFormByCreatedAt = {
    userFormByCreatedAt: {
        nextToken: string;
        items: [UserForm];
    };
};

export type UserForm = {
    id: string;
    formDefinitionID: string;
    nextToken: string;
    questionAnswers: {
        items: [UserAnswer];
    };
};

export type UserFormByCreatedAtPaginated = {
    userFormByCreatedAt: {
        items: [UserFormPaginated];
    };
};

export type UserFormPaginated = {
    id: string;
    formDefinitionID: string;
    questionAnswers: {
        nextToken: string;
        items: UserAnswer[];
    };
};

export type UserAnswer = {
    id: string;
    knowledge: number;
    motivation: number;
    customScaleValue: number;
    updatedAt: string;
    question: Question;
};

export type ListedFormDefinition = {
    listFormDefinitions: {
        items: [
            {
                createdAt: string;
                id: string;
            }
        ];
    };
};

export type UserFormCreated = {
    createUserForm: {
        id: string;
        createdAt: string;
        updatedAt: string;
        owner: string;
    };
};

export type UserFormWithAnswers = {
    id: string;
    createdAt: string;
    questionAnswers: {
        items: [UserAnswer];
    };
};

export type UserFormList = {
    listUserForms: {
        items: [UserFormWithAnswers];
        nextToken: string | null;
    };
};

export type FormProps = {
    createUserForm: () => void;
    submitAndProceed: () => void;
    updateAnswer: (
        category: string,
        sliderMap: Map<string, SliderValues>
    ) => void;
    formDefinition: FormDefinition | null;
    questionAnswers: Map<string, QuestionAnswer[]>;
    categories: string[];
    activeCategory: string;
    setIsCategorySubmitted: (categorySubmitted: boolean) => void;
    isMobile: boolean;
    alerts: AlertState | undefined;
    scrollToTop: () => void;
};

export type CategoryProps = {
    name: string;
    children: JSX.Element[];
    isMobile: boolean;
};

export type UserProps = {
    deleteUserData: () => void;
    listUserForms: () => void;
};

export type StatsProps = {
    data: AnsweredQuestion[];
};

export type FromAppProps = {
    answerProps: FormProps;
    statsProps: StatsProps;
    userProps: UserProps;
};

export type SliderProps = {
    sliderChanged: (newValue: number, motivation: boolean) => void;
    motivation: boolean;
    value: number;
    isMobile: boolean;
};

export type QuestionProps = {
    updateAnswer: (
        category: string,
        sliderMap: Map<string, SliderValues>
    ) => void;
    questionAnswer: QuestionAnswer;
    knowledgeDefaultValue: number;
    motivationDefaultValue: number;
    setIsCategorySubmitted: (categorySubmitted: boolean) => void;
    isMobile: boolean;
    alerts: AlertState | undefined;
    sliderValues: Map<string, SliderValues>;
    setSliderValues: (questionId: string, values: SliderValues) => void;
};

export type BatchCreatedQuestionAnswer = {
    batchCreateQuestionAnswer: {
        answer: number;
        createdAt: string;
        id: string;
        owner: string;
        userFormID: string;
        question: {
            id: string;
            text: string;
            topic: string;
            index: number;
        };
    }[];
};

export type OverviewProps = {
    activePanel: Panel;
    questionAnswers: Map<string, QuestionAnswer[]>;
    categories: string[];
    isMobile: boolean;
    userAnswersLoaded: boolean;
};

export type ScaleDescriptionProps = {
    activePanel: Panel;
    isMobile: boolean;
};

export type YourAnswerProps = {
    activePanel: Panel;
    setIsCategorySubmitted: (categorySubmitted: boolean) => void;
    createUserForm: () => void;
    submitAndProceed: () => void;
    updateAnswer: (
        category: string,
        sliderMap: Map<string, SliderValues>
    ) => void;
    formDefinition: FormDefinition | null;
    questionAnswers: Map<string, QuestionAnswer[]>;
    changeActiveCategory: (newCategoryIndex: string) => void;
    categories: string[];
    activeCategory: string;
    enableAnswerEditMode: () => void;
    answerEditMode: boolean;
    isMobile: boolean;
    alerts: AlertState | undefined;
    checkIfCategoryIsSubmitted: (
        buttonType: MenuButton,
        category?: string | undefined
    ) => void;
    collapseMobileCategories: boolean;
    categoryNavRef: React.MutableRefObject<HTMLInputElement | null>;
    scrollToTop: () => void;
    setCollapseMobileCategories: (collapseMobileCategories: boolean) => void;
};

export interface AlertState {
    qidMap: Map<string, Alert>;
    categoryMap: Map<string, number>;
}

export interface Alert {
    type: AlertType;
    message: string;
}

export type HighlightsProps = {
    questionAnswers: Map<string, QuestionAnswer[]>;
    isMobile: boolean;
};

export type ResultDiagramProps = {
    questionAnswers: Map<string, QuestionAnswer[]>;
    categories: string[];
    isMobile: boolean;
};

export type AnswerDiagramProps = {
    questionAnswers: Map<string, QuestionAnswer[]>;
    activeCategory: string;
    isMobile: boolean;
};

export type NavBarProps = {
    user: any;
    callbackDelete: () => void;
    setAnswerHistoryOpen: (answerHistoryOpen: boolean) => void;
    isMobile: boolean;
};

export type NavBarPropsDesktop = {
    displayAnswers: () => void;
    signout: () => void;
};

export type NavBarPropsMobile = {
    menuButtons: JSX.Element[];
    activePanel: Panel;
    signout: () => void;
};

export type AlertDialogProps = {
    setAlertDialogOpen: (alertDialogOpen: boolean) => void;
    alertDialogOpen: boolean;
    changeActiveCategory: (newCategoryIndex: string) => void;
    clickedCategory: string;
    setIsCategorySubmitted: (categorySubmitted: boolean) => void;
    resetAnswers: () => void;
    isMobile: boolean;
    leaveFormButtonClicked?: () => void;
};

export type AnswerHistoryProps = {
    setHistoryViewOpen: (historyViewOpen: boolean) => void;
    historyViewOpen: boolean;
    history: UserFormWithAnswers[];
    formDefinition?: FormDefinition;
    isMobile: boolean;
};

export type HistoryTreeViewProps = {
    data: UserFormWithAnswers[];
};

export enum UserRole {
    NormalUser,
    SuperAdmin,
    Admin,
    GroupLeader,
}

export type ContentProps = {
    setAnswerHistoryOpen: (historyViewOpen: boolean) => void;
    answerHistoryOpen: boolean;
    isMobile: boolean;
    signout: () => void;
    collapseMobileCategories: boolean;
    categoryNavRef: React.MutableRefObject<HTMLInputElement | null>;
    scrollToTop: () => void;
    mobileNavRef: React.MutableRefObject<HTMLInputElement | null>;
    setCollapseMobileCategories: (collapseMobileCategories: boolean) => void;
    setScaleDescOpen: Dispatch<SetStateAction<boolean>>;
    setFirstTimeLogin: Dispatch<SetStateAction<boolean>>;
    setShowFab: Dispatch<SetStateAction<boolean>>;
};

export type ChartData = {
    name: string;
    valueKnowledge: number[];
    valueMotivation: number[];
};

export type CustomScaleLabelsChartData = {
    name: string;
    startLabel: string | undefined;
    middleLabel: string | undefined;
    endLabel: string | undefined;
    value: number;
};

export type CombinedChartProps = {
    chartData: ChartData[];
    type?: OverviewType;
    topSubjects?: Map<string, { kTop: string; mTop: string }>;
    className?: string;
};

export type CustomScaleChartProps = {
    chartData: CustomScaleLabelsChartData[];
};

//Used in form and question
export type SliderKnowledgeMotivationValues = {
    knowledge: number;
    motivation: number;
};

//Used in form and question [questionType === QuestionType.customScaleLabels]
export type SliderCustomScaleValue = {
    customScaleValue: number;
};

export type SliderValues =
    | SliderKnowledgeMotivationValues
    | SliderCustomScaleValue;

export type ProgressProps = {
    //Used in form and question
    alerts: AlertState | undefined;
    totalQuestions: number;
};
