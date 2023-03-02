import { TranslationKeysSchema } from "../schema";

export const norwegian: TranslationKeysSchema = {
    translation: {
        confirm: "Bekreft",
        abort: "Avbryt",
        menu: {
            overview: "OVERSIKT",
            myAnswers: "MINE SVAR"
        },
        navbar: {
            help: "Hjelp",
            signOut: "Logg ut",
            competenceMappingFor: "Kompetansekartlegging for",
            doYouWantToDeleteYourAnswers: "Ønsker du å slette svarene dine?",
            thisWillDeleteAllAnswers: "OBS: Dette vil slette alle innsendte og lagrede svar!"
        },
        content: {
            unAnswared: "Ubesvart!",
            shouldBeUpdatedLastAnswered: "Bør oppdateres! Sist besvart: ",
            answerOutdatedOrIncomplete: "Besvarelsen er utdatert eller ikke komplett!",
            unansweredOrOutdatedQuestionsInCategory: "Ikke besvart eller utdaterte spørsmål i kategori"
        },
        alertDialog: {
            nbAnswersNotSaved: "Obs! Svarene dine er ikke lagret.",
            leavingWillDiscardChanges: "Hvis du forlater skjemaet nå vil ikke endringene du har gjort bli lagret.",
            leaveForm: "Forlat skjemaet",
            stayOnForm: "Bli på skjemaet"
        }
    },
}
