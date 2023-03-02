export type TranslationKeysSchema = {
    translation: {
        confirm: string,
        abort: string,
        menu: {
            overview: string,
            myAnswers: string
        }
        navbar: {
            help: string,
            signOut: string,
            competenceMappingFor: string,
            doYouWantToDeleteYourAnswers: string,
            thisWillDeleteAllAnswers: string
        },
        content: {
            unAnswared: string,
            shouldBeUpdatedLastAnswered: string,
            answerOutdatedOrIncomplete: string,
            unansweredOrOutdatedQuestionsInCategory: string
        },
        alertDialog: {
            nbAnswersNotSaved: string,
            leavingWillDiscardChanges: string,
            leaveForm: string,
            stayOnForm: string
        }
    },
}