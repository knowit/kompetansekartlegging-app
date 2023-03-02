import { TranslationKeysSchema } from "../schema";

export const English: TranslationKeysSchema = {
    translation: {
        confirm: "confirm",
        abort: "abort",
        notAnswered: "Not answered",
        knowledge: "Knowledge",
        motivation: "Motivation",
        scaleDescription: "Scale description",
        menu: {
            overview: "Overview",
            myAnswers: "My answers",
            myGroup: "My group",
            admin: "Admin",
        },
        navbar: {
            help: "Help",
            signOut: "Sign out",
            knowledgeMappingFor: "Kompetansekartlegging for",
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
        },
        overview: {
            yourTopAmbitionsWillBeDisplayedHere: "Your top ambitions will be displayed here",
            yourTopStrengthsWillBeDisplayedHere: "Your top strengths will be displayed here",
            focusAreas: "FOCUS AREAS",
            topStrengths: "TOP STRENGTHS",
            topAmbitions: "TOP AMBITIONS",
            overviewType: {
                average: "AVG",
                median: "MEDIAN",
                highest: "TOP"
            }
        },
        knowledgeScale: {
            knowledgeScale: "Knowledge scale",
            superstar: "Superstar",
            expert: "Expert",
            professional: "Professional level",
            potentiallyUsable: "Potentially usable knowledge",
            someInsight: "Some insight",
            unfamiliar: "Unfamiliar area",
            desc: {
                superstar: "An sought-after specialist, who acts as innovative or strategic force in the area",
                expert: "Has particularly good control and an established potition in the area",
                professional: "Has good control and can work independently on non-trivial issues within the area",
                potentiallyUsable: "Knowledge that has either not been tested in assignments or where support from others in the team is currently needed",
                someInsight: "Has some insight into the area, as well as the ability to reason about or solve tasks on a non-professional level within the area",
            }
        },
        motivationScale: {
            motivationScale: "Motivation scale",
            enthusiast: "Enthusiast. I am passionate about this.",
            good: "Good. This is what I want to work on.",
            curious: "Curious. I want to learn more about this.",
            ish: "Well. I can if it's needed.",
            neutral: "Neutral. No opinion.",
            no: "No. I do not want to work on this."
        }
    },
}
