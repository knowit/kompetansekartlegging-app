import { TranslationKeysSchema } from "../schema";

export const english: TranslationKeysSchema = {
    translation: {
        confirm: "confirm",
        abort: "abort",
        menu: {
            overview: "OVERVIEW",
            myAnswers: "MY ANSWERS"
        },
        navbar: {
            help: "Help",
            signOut: "Sign out",
            competenceMappingFor: "Kompetansekartlegging for",
            doYouWantToDeleteYourAnswers: "Do you want to delete your answers?",
            thisWillDeleteAllAnswers: "N.B. This will delete all submitted and saved answers!"
        },
        content: {
            unAnswared: "Unanswered!",
            shouldBeUpdatedLastAnswered: "Should be updated! Last answered: ",
            answerOutdatedOrIncomplete: "The answer is outdated or incomplete!",
            unansweredOrOutdatedQuestionsInCategory: "Unanswered or outdated questions in category"
        },
        alertDialog: {
            nbAnswersNotSaved: "N.B. Your answers are not saved.",
            leavingWillDiscardChanges: "Leaving this form will discard your changes.",
            leaveForm: "Leave form",
            stayOnForm: "Stay on form"
        }
    },
}
