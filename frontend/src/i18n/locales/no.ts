import { TranslationKeysSchema } from "../schema";

export const Norwegian: TranslationKeysSchema = {
    translation: {
        confirm: "Bekreft",
        abort: "Avbryt",
        notAnswered: "Ikke besvart",
        knowledge: "Kompetanse",
        motivation: "Motivasjon",
        scaleDescription: "Skalabeskrivelse",
        menu: {
            overview: "Oversikt",
            myAnswers: "Mine svar",
            myGroup: "Min gruppe",
            admin: "Admin",
        },
        navbar: {
            help: "Hjelp",
            signOut: "Logg ut",
            knowledgeMappingFor: "Kompetansekartlegging for",
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
        },
        overview: {
            yourTopAmbitionsWillBeDisplayedHere: "Her kommer dine topp-ambisjoner",
            yourTopStrengthsWillBeDisplayedHere: "Her kommer dine topp-styrker",
            focusAreas: "FOKUSOMRÅDER",
            topStrengths: "TOPP STYRKER",
            topAmbitions: "TOPP AMBISJONER",
            overviewType: {
                average: "SNITT",
                median: "MEDIAN",
                highest: "TOPP"
            }
        },
        knowledgeScale: {
            knowledgeScale: "Kompetanseskala",
            superstar: "Superstjerne",
            expert: "Ekspert",
            professional: "Profesjonelt nivå",
            potentiallyUsable: "Potensielt brukbar kompetanse",
            someInsight: "Noe innsikt",
            unfamiliar: "Kjenner ikke til området",
            desc: {
                superstar: "En etterspurt spesialist, som fungerer som nyskapende eller strategisk kraft på området",
                expert: "Har særdeles god kontroll og en etablert posisjon på området",
                professional: "Har god kontroll og kan jobbe selvstendig med ikke-trivielle problemstillinger innenfor området",
                potentiallyUsable: "Kompetanse som enten ikke er testet i oppdrag eller der man inntil videre trenger støtte fra andre i teamet",
                someInsight: "Har noe innsikt i området, samt evne til å resonnere over eller løse oppgaver på et ikke-profesjonelt nivå innenfor området"
            }
        },
        motivationScale: {
            motivationScale: "Motivasjonsskala",
            enthusiast: "Ildsjel. Jeg brenner for dette.",
            good: "Godt. Dette er det jeg ønsker å jobbe med.",
            curious: "Nysgjerrig. Dette vil jeg lære mer om.",
            ish: "Tja. Kan hvis det er behov.",
            neutral: "Nøytral. Ingen formening.",
            no: "Nei. Dette vil jeg ikke jobbe med."
        }
    },
}
