export type TranslationKeysSchema = {
    translation: {
        confirm: string,
        abort: string,
        notAnswered: string,
        knowledge: string,
        motivation: string,
        scaleDescription: string,
        errorOccured: string,
        thisIsATestEnvironment: string,
        close: string,
        menu: {
            overview: string,
            myAnswers: string,
            myGroup: string,
            admin: string,
        }
        navbar: {
            help: string,
            signOut: string,
            knowledgeMappingFor: string,
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
        },
        overview: {
            yourTopAmbitionsWillBeDisplayedHere: string,
            yourTopStrengthsWillBeDisplayedHere: string,
            focusAreas: string,
            topStrengths: string,
            topAmbitions: string,
            overviewType: {
                average: string,
                median: string,
                highest: string
            },
        },
        knowledgeScale: {
            knowledgeScale: string,
            superstar: string,
            expert: string,
            professional: string,
            potentiallyUsable: string,
            someInsight: string,
            unfamiliar: string
            desc: {
                superstar: string,
                expert: string,
                professional: string,
                potentiallyUsable: string,
                someInsight: string
            }
        },
        motivationScale: {
            motivationScale: string,
            enthusiast: string,
            good: string,
            curious: string,
            ish: string,
            neutral: string,
            no: string
        },
        myAnswers: {
            fillOut: string,
            blockHasNotBeenCompleted: string
        }
    },
}
