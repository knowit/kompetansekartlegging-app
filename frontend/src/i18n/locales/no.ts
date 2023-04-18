import { LanguageSchema } from '../schema'

export const Norwegian: LanguageSchema = {
  translation: {
    confirm: 'Bekreft',
    abort: 'Avbryt',
    add: 'Legg til',
    remove: 'Fjern',
    save: 'Lagre',
    answer: 'Svar',
    notAnswered: 'Ikke besvart',
    competence: 'Kompetanse',
    motivation: 'Motivasjon',
    scaleDescription: 'Skalabeskrivelse',
    errorOccured: 'Noe gikk galt: ',
    thisIsATestEnvironment: 'NB: Dette er et test-miljø!',
    close: 'Lukk',
    employee: 'Ansatt',
    email: 'E-post',
    groupLeader: 'Gruppeleder',
    administrator: 'Administrator',
    username: 'Brukernavn',
    name: 'Navn',
    description: 'Beskrivelse',
    groupDefiniteForm: 'gruppen',
    roleDefiniteForm: 'rollen',
    searchForEmployeeInOrganization: 'Søk etter ansatt i {{organization}}',
    nameCantBeEmpty: 'Navn kan ikke være tom.',
    addAdministrator: 'Legg til administrator',
    pressHereToSeeWhatTheIconsMean: 'Trykk her for å se hva ikonene betyr!',
    noOrganizationNameFound: 'Fant ikke organisasjonsnavn',
    noOrganizationFound: 'Ingen organisasjon funnet',
    errorWhileFetchingUpdatedAtFromLatestUserForm: 'Feil ved henting av updatedAt fra siste UserForm',
    login: {
        competenceMapping: 'Kompetansekartlegging',
        signIn: 'Logg inn',
        devSignIn: 'Dev login',
        enterYourEmail: 'Skriv din E-post',
        password: 'Passord',
        enterYourPassword: 'Skriv ditt Passord',
        forgotYourPassword: 'Glemt passord?',
        userDoesNotExist: 'Brukeren eksisterer ikke.'
    },
    createAccount: {
      enterYourName: 'Skriv ditt Navn',
      confirmPassword: 'Bekreft Passord',
      pleaseConfirmYourPassword: 'Vennligst bekreft Passordet',
      createAccount: 'Opprett Konto',
      passwordCantBeEmpty: 'Passord kan ikke være tom',
      weEmailedYou: 'Vi sendte deg e-post',
      yourCodeIsOnTheWay: 'Koden din er på vei. For å logge inn, skriv koden vi sendte til',
      itMayTakeAMinuteToArrive: 'Det kan ta litt tid før den kommer',
      confirmationCode: 'Bekreftelseskode',
      resendCode: 'Send kode på nytt',
      enterYourCode: 'Skriv inn koden',
      confirmationCodeCantBeEmpty: 'Bekreftelseskode kan ikke være tom',
      userAlreadyExists: 'Brukeren finnes allerede',
      creatingAccount: 'Oppretter konto',
      confirming: 'Bekrefter'
    },
    resetPassword: {
      resetPassword: 'Tilbakestill Passord',
      enterYourEmail: 'Skriv din e-post',
      sendCode: 'Send kode',
      backToSignIn: 'Tilbake til innlogging',
      sending: 'Sender',
      submit: 'Send inn',
      submitting: 'Sender',
      code: 'Kode',
      newPassword: 'Nytt Passord',
      yourPasswordsMustMatch: 'Passordene må være like'
    },
    menu: {
      overview: 'Oversikt',
      myAnswers: 'Mine svar',
      myGroup: 'Min gruppe',
      admin: 'Admin',
      superAdmin: 'Super-admin',
      submenu: {
        editGroupLeaders: 'Rediger gruppeledere',
        editGroups: 'Rediger grupper',
        editAdministrators: 'Rediger administratorer',
        editCatalogs: 'Rediger kataloger',
        downloadCatalogs: 'Last ned kataloger',
        editOrganizations: 'Rediger organisasjoner',
        editSuperAdministrators: 'Rediger super-administratorer',
      },
    },
    navbar: {
      help: 'Hjelp',
      signOut: 'Logg ut',
      competenceMappingFor: 'Kompetansekartlegging for',
      doYouWantToDeleteYourAnswers: 'Ønsker du å slette svarene dine?',
      thisWillDeleteAllAnswers: 'OBS: Dette vil slette alle innsendte og lagrede svar!',
      profilePicture: 'Profilbilde',
    },
    content: {
      unAnswered: 'Ubesvart!',
      notAnswered: 'Ikke svart',
      notDefined: 'Ikke definert',
      answerHistory: 'Svarhistorikk',
      shouldBeUpdatedLastAnswered: 'Bør oppdateres! Sist besvart: {{date}}',
      answerOutdatedOrIncomplete: 'Besvarelsen er utdatert eller ikke komplett!',
      unansweredOrOutdatedQuestionsInCategory: 'Ikke besvart eller utdaterte spørsmål i kategori',
    },
    alertDialog: {
      nbAnswersNotSaved: 'Obs! Svarene dine er ikke lagret.',
      leavingWillDiscardChanges: 'Hvis du forlater skjemaet nå vil ikke endringene du har gjort bli lagret.',
      leaveForm: 'Forlat skjemaet',
      stayOnForm: 'Bli på skjemaet',
    },
    overview: {
      yourTopAmbitionsWillBeDisplayedHere: 'Her kommer dine topp-ambisjoner',
      yourTopStrengthsWillBeDisplayedHere: 'Her kommer dine topp-styrker',
      focusAreas: 'Fokusområder',
      topStrengths: 'Topp styrker',
      topAmbitions: 'Topp ambisjoner',
      overviewType: {
        average: 'Snitt',
        median: 'Median',
        highest: 'Topp',
      },
    },
    competenceScale: {
      competenceScale: 'Kompetanseskala',
      superstar: 'Superstjerne',
      expert: 'Ekspert',
      professional: 'Profesjonelt nivå',
      potentiallyUsable: 'Potensielt brukbar kompetanse',
      someInsight: 'Noe innsikt',
      unfamiliar: 'Kjenner ikke til området',
      description: {
        superstar: 'En etterspurt spesialist, som fungerer som nyskapende eller strategisk kraft på området',
        expert: 'Har særdeles god kontroll og en etablert posisjon på området',
        professional: 'Har god kontroll og kan jobbe selvstendig med ikke-trivielle problemstillinger innenfor området',
        potentiallyUsable: 'Kompetanse som enten ikke er testet i oppdrag eller der man inntil videre trenger støtte fra andre i teamet',
        someInsight: 'Har noe innsikt i området, samt evne til å resonnere over eller løse oppgaver på et ikke-profesjonelt nivå innenfor området',
      },
    },
    motivationScale: {
      motivationScale: 'Motivasjonsskala',
      enthusiast: 'Ildsjel. Jeg brenner for dette.',
      good: 'Godt. Dette er det jeg ønsker å jobbe med.',
      curious: 'Nysgjerrig. Dette vil jeg lære mer om.',
      ish: 'Tja... Kan hvis det er behov.',
      neutral: 'Nøytral. Ingen formening.',
      no: 'Nei. Dette vil jeg ikke jobbe med.',
    },
    myAnswers: {
      chooseCategory: 'Velg en kategori for å se dine svar',
      fillOut: 'Fyll ut',
      blockHasNotBeenCompleted: 'Blokken er ikke ferdig utfylt!',
      minutes: 'minutter',
      days: 'dager',
      itHasBeenTimeSinceTheBlockWasUpdated: 'Det har gått {{time}} siden blokken ble oppdatert!',
      theBlockWasLastUpdatedDate: 'Blokken ble sist oppdatert {{date}}',
      submitAnswersAndQuit: 'Send inn svar og avslutt',
      saveAndContinue: 'Lagre og gå videre',
      changeAnswers: 'Endre svar',
    },
    myGroup: {
      lastAnswered: 'Sist besvart',
      removeFromGroup: 'Fjern fra gruppe',
      addMembers: 'Legg til medlemmer',
      theEmployeeMustHaveSignedInOnce: 'Den ansatte må ha logget seg inn i appen minst en gang.',
      showOnlyEmployeesWithoutGroupLeader: 'Vis bare ansatte uten gruppeleder',
      noGroupLeader: 'Mangler gruppeleder',
    },
    admin: {
      areYouSureYouWantToDeleteNameFromRole: 'Er du sikker på at du har lyst til å fjerne {{name}} fra {{role}}?',
      removeNameFromRole: 'Fjern {{name}} fra {{role}}?',
      editGroupLeaders: {
        description: 'Gruppeledere har tilgang til sine egne gruppebarns svar. De kan også velge sine gruppebarn. På denne siden kan du legge til og fjerne gruppeledere.',
        addGroupLeader: 'Legg til gruppeleder',
        rememberToReplaceGroupLeader: 'Husk å sette en ny gruppeleder for de gruppene brukeren var ansvarlig for.',
      },
      editGroups: {
        description: 'En gruppe består av en gruppeleder og flere gruppebarn. På denne siden kan du lage nye grupper, slette grupper, endre gruppelederen til en gruppe og legge til og fjerne ansatte til og fra grupper.',
        chooseGroupLeaderForTheNewGroup: 'Velg gruppeleder til den nye gruppen',
        chooseNewGroupLeader: 'Velg ny gruppeleder',
        choose: 'Velg',
        createNewGroup: 'Lag ny gruppe',
        createGroup: 'Lag gruppe',
        groupLeaderRemoved: 'Gruppeleder fjernet',
        removeGroup: 'Fjern gruppe',
        removeGroupQuestion: 'Fjern gruppe?',
        areYouSureYouWantToRemoveTheGroup: 'Er du sikker på at du har lyst til å fjerne gruppen?',
        members: 'Medlemmer',
        details: 'Detaljer',
        numberOfGroupMembers: 'Antall gruppemedlemmer',
      },
      editAdmins: {
        description: 'Administratorer har tilgang til alles svar. De kan også velge hvem som er gruppeledere og administratorer, og kan lage og fjerne grupper. På denne siden kan du legge til og fjerne administratorer.',
        editAdministrators: 'Rediger administratorer'
      },
      editCatalogs: {
        description: 'På denne siden kan du lage nye kataloger, fjerne kataloger og endre på eksisterende kataloger, kategorier og spørsmål.',
        createNewCatalog: 'Lag ny katalog',
        lastUpdated: 'Sist oppdatert',
        notSet: 'Ikke satt',
        activate: 'Bruk',
        activateCatalog: 'Bruk katalog',
        activateCatalogQuestion: 'Bruk katalog?',
        modifyCatalog: 'Endre katalog',
        removeCatalog: 'Fjern katalog',
        removeCatalogQuestion: 'Fjern katalog?',
        areYouSureYouWantToRemoveThisCatalog: 'Er du sikker på at du har lyst til å fjerne denne katalogen? Dette vil ikke slette svarene til de ansatte, men gjør det vanskelig å koble svar opp mot spørsmålsett.',
        nameOfNewCatalog: 'Navnet på den nye katalogen',
        areYouSureYouWantToActivateThisCatalog: 'Er du sikker på at du har lyst til å bruke denne katalogen? Dette vil endre spørsmålsettet de ansatte svarer på.',
        catalogs: 'Kataloger',
        modify: 'Endre',
        addNewCategory: 'Legg til ny kategori',
        nameOfNewCategory: 'Navn på ny kategori',
        nameOfTheCategoryCantBeEmpty: 'Navnet på kategorien kan ikke være tomt.',
        removeTheCategoryQuestion: "Fjern kategorien '{{categoryName}}'?",
        areYouSureYouWantToRemoveThisCategory: 'Er du sikker på at du vil fjerne denne kategorien?',
        cantRemoveCategoryAsItStillContainsQuestions: 'Kan ikke fjerne kategorien fordi den fortsatt inneholder spørsmål.',
        addNewQuestion: 'Legg til nytt spørsmål',
        subject: 'Emne',
        subjectCantBeEmpty: 'Emnet kan ikke være tomt.',
        descriptionCantBeEmpty: 'Beskrivelsen kan ikke være tom.',
        typeOfQuestion: 'Spørsmålstype',
        competenceSlashMotivation: 'Kompetanse / Motivasjon',
        customScaleHeadlines: 'Egendefinerte skala overskrifter',
        start: 'Start',
        middle: 'Midt',
        end: 'Slutt',
        category: 'Kategori',
        deleteTheQuestion: "Fjern spørsmålet '{{question}}'?",
        areYouSureYouWantToDeleteThisQuestion: 'Er du sikker på at du har lyst til å fjerne dette spørsmålet? Denne handlingen kan ikke angres. Svar på dette spørsmålet kan da ikke kobles opp mot spørsmålet som ble svart på.',
        subjectOfTheNewQuestion: 'Emnet på det nye spørsmålet',
        noQuestionsInThisCategoryYet: 'Ingen spørsmål i denne kategorien ennå.',
        noCategoriesInThisCatalogYet: 'Ingen kategorier i denne katalogen ennå.',
        copyCatalog: 'Kopier katalog',
        copy: 'Kopier'
      },
      downloadCatalogs: {
        description: 'På denne siden kan du laste ned Excel-rapport fra katalogen du ønsker.',
        catalog: 'Katalog',
        created: 'Opprettet',
        downloadFailedIsTheCatalogEmpty: 'Nedlasting feilet.\nEr katalogen tom?',
        download: 'Last ned'
      }
    },
    superAdmin: {
      identifierAttribute: 'Identifier Attribute',
      editOrganizations: {
        description: 'På denne siden kan du legge til, fjerne og oppdatere organisasjoner.',
        id: 'ID',
        adminEmail: 'Admin E-post',
        addOrganization: 'Legg til organisasjon',
        removeOrganization: "Fjern organisasjonen '{{organization}}'?",
        areYouSureYouWantToRemoveTheOrganization: "Er du sikker på at du har lyst til å fjerne organisasjonen '{{organization}}'?",
        addNewOrganization: 'Legg til ny organisasjon',
        idCantBeEmptyOrContainZero: "ID kan ikke være tom eller inneholde '0'.",
        identifierAttributeCantBeEmpty: 'Identifier attribute kan ikke være tom.',
        adminEmailIsInvalid: 'Admin e-post er ugyldig.',
      },
      editSuperAdministrators: {
        description: 'På denne siden kan du legge til og fjerne super-administratorer.',
        superAdministrator: 'Super-administrator',
        addSuperAdministrator: 'Legg til super-administrator',
      },
      editOrganizationAdministrators: {
        description: 'På denne siden kan du legge til og fjerne administratorer for spesifikke organisasjoner.',
      }
    },
    adminApi: {
      result: {
        removedUserFromGroup: "Fjernet '{{username}}' fra '{{groupname}}'.",
        addedUserToGroup: "'{{username}}' lagt til i '{{groupname}}'."
      },
      error: {
        couldNotRemoveUserFromGroup: "Kunne ikke fjerne brukeren '{{username}}' fra gruppen '{{groupname}}'.",
        couldNotAddUserToGroup: "Kunne ikke legge til brukeren '{{username}}' i gruppen '{{groupname}}'.",
        couldNotGetAListOfUsersInGroup: "Kunne ikke hente liste over medlemmer i gruppen '{{groupname}}'.",
        couldNotGetAListOfAllUsers: 'Kunne ikke hente liste over alle brukere.'
      }
    },
    catalogApi: {
      couldNotGetAListOfAllFormDefinitionsForOrganizationID: "Kunne ikke hente liste med alle kataloger for organisasjon med ID '{{organizationID}}'.",
      listAllFormDefinitionsByOrganizationIDError: "listAllFormDefinitionsByOrganizationID: Kunne ikke hente liste med alle kataloger for organisasjon med ID '{{organizationID}}'.",
      couldNotGetAListOfCategoriesForFormDefinitionID: "Kunne ikke hente liste med alle kategorier for katalog med ID '{{formDefinitionID}}'.",
      couldNotGetAListOfQuestionsForCategoryID: "Kunne ikke hente liste med spørsmål for kategori med ID '{{categoryID}}'.",
      couldNotUpdateCategoryWithID: "Kunne ikke oppdatere kategori med ID '{{categoryID}}'",
      couldNotUpdateQuestionWithID: "Kunne ikke oppdatere spørsmål med ID '{{questionID}}'",
      couldNotUpdateFormDefinitionWithID: "Kunne ikke oppdatere katalog med ID '{{formDefinitionID}}'.",
      couldNotDeleteFormDefinitionWithID: "Kunne ikke slette katalog med ID '{{formDefinitionID}}'.",
      couldNotDeleteCategoryWithID: "Kunne ikke slette kategori med ID '{{categoryID}}'.",
      couldNotDeleteQuestionWithID: "Kunne ikke slette spørsmål med ID '{{questionID}}'.",
      couldNotCreateTheFormDefinition: "Kunne ikke opprette katalogen '{{catalogName}}'.",
      couldNotCreateTheCategory: "Kunne ikke opprette kategorien '{{categoryName}}'.",
      couldNotCreateTheQuestion: "Kunne ikke opprette spørsmålet '{{question}}'."
    },
    groupsApi: {
      couldNotGetMembersOfGroupWithID: "Kunne ikke hente medlemmer av gruppen med ID '{{groupID}}'.",
      couldNotGetAListOfAllGroups: 'Kunne ikke hente liste med alle grupper.',
      couldNotGetAListOfAllUsers: 'Kunne ikke hente liste med alle brukere.',
      couldNotAddUserWithIDToGroupWithID: "Kunne ikke legge legge til brukeren med ID '{{userID}}' i gruppen med ID '{{groupID}}'.",
      couldNotUpdateUserWithIDToGroupWithID: "Kunne ikke oppdatere brukeren med ID '{{userID}}' til gruppen med ID '{{groupID}}'.",
      couldNotRemoveUserWithIDFromGroupWithID: "Kunne ikke fjerne brukeren med ID '{{userID}}' fra gruppen med ID '{{groupID}}'.",
      couldNotAddAGroup: 'Kunne ikke legge til gruppe.',
      couldNotRemoveGroupWithID: "Kunne ikke fjerne gruppen med ID '{{groupID}}'.",
      couldNotSetGroupLeaderToUsernameOnGroupWithID: "Kunne ikke sette gruppeleder til '{{username}}' for gruppen med ID '{{groupID}}'."
    },
    superAdminApi: {
        couldNotGetAListOfOrganizations: 'Kunne ikke hente en liste med organisasjoner.',
        couldNotAddTheOrganization: "Kunne ikke legge til organisasjonen '{{organizationName}}'.",
        couldNotDeleteTheOrganization: "Kunne ikke slette organisasjonen '{{organizationName}}'.",
        theNewOrganizationWasNotProperlyConfigured: "Den nye organisasjonen '{{organizationName}}' ble ikke konfigurert riktig.",
    },
    aria: {
      selectLanguageLanguageIsSelected: 'velg språk, {{language}} er valgt',
      helpButton: 'hjelp-knapp',
      toggleDropdownMenu: 'Åpne eller lukk nedtrekksmeny',
      menu: 'meny'
    }
  }
}
