import { TranslationKeysSchema } from "../schema";

export const Norwegian: TranslationKeysSchema = {
    translation: {
        confirm: "Bekreft",
        abort: "Avbryt",
        remove: "Fjern",
        notAnswered: "Ikke besvart",
        knowledge: "Kompetanse",
        motivation: "Motivasjon",
        scaleDescription: "Skalabeskrivelse",
        errorOccured: "Noe gikk galt: {{error}}",
        thisIsATestEnvironment: "NB: Dette er et test-miljø!",
        close: "LUKK",
        employee: "Ansatt",
        email: "E-post",
        add: "Legg til",
        groupLeader: "Gruppeleder",
        username: "Brukernavn",
        theGroup: "gruppen",
        theRole: "rollen",
        menu: {
            overview: "Oversikt",
            myAnswers: "Mine svar",
            myGroup: "Min gruppe",
            admin: "Admin",
            superAdmin: "Super-admin",
            submenu: {
                editGroupLeaders: "Rediger gruppeledere",
                editGroups: "Rediger grupper",
                editAdministrators: "Rediger administratorer",
                editCatalogs: "Rediger kataloger",
                editOrganizations: "Rediger organisasjoner",
                editSuperAdministrators: "Rediger super-administratorer",
                editOrganizationAdministrators: "Rediger organisasjon-administratorer"
            }
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
            shouldBeUpdatedLastAnswered: "Bør oppdateres! Sist besvart: {{date}}",
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
        },
        myAnswers: {
            fillOut: "Fyll ut",
            blockHasNotBeenCompleted: "Blokken er ikke ferdig utfylt!"
        },
        myGroup: {
            lastAnswered: "Sist besvart",
            removeFromGroup: "Fjern fra gruppe",
            addMembers: "Legg til medlemmer",
            searchForEmployeeIn: "Søk etter ansatt i {{company}}",
            theEmployeeMustHaveSignedInOnce: "Den ansatte må ha logget seg inn i appen minst en gang.",
            showOnlyEmployeesWithoutGroupLeader: "Vis bare ansatte uten gruppeleder",
            noGroupLeader: "Mangler gruppeleder"
        },
        admin: {
            areYouSureYouWantToDeleteNameFromRole: "Er du sikker på at du har lyst til å fjerne {{name}} fra {{role}}?",
            removeNameFromRole: "Fjern {{name}} fra {{role}}?",
            searchForEmployeeInOrganization: "Søk etter ansatt i {{organization}}",
            editGroupLeaders: {
                description: "Gruppeledere har tilgang til sine egne gruppebarns svar. De kan også velge sine gruppebarn. På denne siden kan du legge til og fjerne gruppeledere.",
                addGroupLeader: "Legg til gruppeleder",
                rememberToReplaceGroupLeader: "Husk å sette en ny gruppeleder for de gruppene brukeren var ansvarlig for.",
            },
            editGroups: {
                description: "En gruppe består av en gruppeleder og flere gruppebarn. På denne siden kan du lage nye grupper, slette grupper, endre gruppelederen til en gruppe og legge til og fjerne ansatte til og fra grupper.",
                chooseGroupLeaderForTheNewGroup: "Velg gruppeleder til den nye gruppen",
                chooseNewGroupLeader: "Velg ny gruppeleder",
                choose: "Velg",
                createNewGroup: "Lag ny gruppe",
                groupLeaderRemoved: "Gruppeleder fjernet",
                removeGroup: "Fjern gruppe",
                members: "Medlemmer",
                details: "Detaljer",
                numberOfGroupMembers: "Antall gruppemedlemmer",
            },
            editAdmins: {
                editAdministrators: "Rediger administratorer",
                description: "Administratorer har tilgang til alles svar. De kan også velge hvem som er gruppeledere og administratorer, og kan lage og fjerne grupper. På denne siden kan du legge til og fjerne administratorer.",
                addAdministrator: "Legg til administrator"
            }
        }
    }
}
