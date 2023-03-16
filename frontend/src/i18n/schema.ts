export type LanguageSchema = {
  translation: {
    confirm: string
    abort: string
    add: string
    remove: string
    save: string
    answer: string
    notAnswered: string
    competence: string
    motivation: string
    scaleDescription: string
    errorOccured: string
    thisIsATestEnvironment: string
    close: string
    employee: string
    email: string
    groupLeader: string
    administrator: string
    username: string
    name: string
    description: string
    groupDefiniteForm: string
    roleDefiniteForm: string
    searchForEmployeeInOrganization: string
    nameCantBeEmpty: string
    addAdministrator: string
    pressHereToSeeWhatTheIconsMean: string
    noOrganizationNameFound: string
    noOrganizationFound: string
    errorWhileFetchingUpdatedAtFromLatestUserForm: string
    login: {
      competenceMapping: string
      signIn: string
      devSignIn: string
      enterYourEmail: string
      password: string
      enterYourPassword: string
      forgotYourPassword: string
      userDoesNotExist: string
    }
    createAccount: {
      enterYourName: string
      confirmPassword: string
      pleaseConfirmYourPassword: string
      createAccount: string
      passwordCantBeEmpty: string
      weEmailedYou: string
      yourCodeIsOnTheWay: string
      itMayTakeAMinuteToArrive: string
      confirmationCode: string
      resendCode: string
      enterYourCode: string
      confirmationCodeCantBeEmpty: string
      userAlreadyExists: string
      creatingAccount: string
      confirming: string
    }
    resetPassword: {
      resetPassword: string
      enterYourEmail: string
      sendCode: string
      backToSignIn: string
      sending: string
      submit: string
      submitting: string
      code: string
      newPassword: string
      yourPasswordsMustMatch: string
    }
    menu: {
      overview: string
      myAnswers: string
      myGroup: string
      admin: string
      superAdmin: string
      submenu: {
        editGroupLeaders: string
        editGroups: string
        editAdministrators: string
        editCatalogs: string
        downloadCatalogs: string
        editOrganizations: string
        editSuperAdministrators: string
        editOrganizationAdministrators: string
      }
    }
    navbar: {
      help: string
      signOut: string
      competenceMappingFor: string
      doYouWantToDeleteYourAnswers: string
      thisWillDeleteAllAnswers: string
      profilePicture: string
    }
    content: {
      unAnswered: string
      notAnswered: string
      notDefined: string
      answerHistory: string
      shouldBeUpdatedLastAnswered: string
      answerOutdatedOrIncomplete: string
      unansweredOrOutdatedQuestionsInCategory: string
    }
    alertDialog: {
      nbAnswersNotSaved: string
      leavingWillDiscardChanges: string
      leaveForm: string
      stayOnForm: string
    }
    overview: {
      yourTopAmbitionsWillBeDisplayedHere: string
      yourTopStrengthsWillBeDisplayedHere: string
      focusAreas: string
      topStrengths: string
      topAmbitions: string
      overviewType: {
        average: string
        median: string
        highest: string
      }
    }
    competenceScale: {
      competenceScale: string
      superstar: string
      expert: string
      professional: string
      potentiallyUsable: string
      someInsight: string
      unfamiliar: string
      description: {
        superstar: string
        expert: string
        professional: string
        potentiallyUsable: string
        someInsight: string
      }
    }
    motivationScale: {
      motivationScale: string
      enthusiast: string
      good: string
      curious: string
      ish: string
      neutral: string
      no: string
    }
    myAnswers: {
      fillOut: string
      blockHasNotBeenCompleted: string
      minutes: string
      days: string
      itHasBeenTimeSinceTheBlockWasUpdated: string
      theBlockWasLastUpdatedDate: string
      submitAnswersAndQuit: string
      saveAndContinue: string
      changeAnswers: string
    }
    myGroup: {
      lastAnswered: string
      removeFromGroup: string
      addMembers: string
      theEmployeeMustHaveSignedInOnce: string
      showOnlyEmployeesWithoutGroupLeader: string
      noGroupLeader: string
    }
    admin: {
      areYouSureYouWantToDeleteNameFromRole: string
      removeNameFromRole: string
      editGroupLeaders: {
        description: string
        addGroupLeader: string
        rememberToReplaceGroupLeader: string
      }
      editGroups: {
        description: string
        chooseGroupLeaderForTheNewGroup: string
        chooseNewGroupLeader: string
        choose: string
        createNewGroup: string
        createGroup: string
        groupLeaderRemoved: string
        removeGroup: string
        removeGroupQuestion: string
        areYouSureYouWantToRemoveTheGroup: string
        members: string
        details: string
        numberOfGroupMembers: string
      }
      editAdmins: {
        description: string
        editAdministrators: string
      }
      editCatalogs: {
        description: string
        createNewCatalog: string
        lastUpdated: string
        notSet: string
        activate: string
        activateCatalog: string
        activateCatalogQuestion: string
        modifyCatalog: string
        removeCatalog: string
        removeCatalogQuestion: string
        areYouSureYouWantToRemoveThisCatalog: string
        nameOfNewCatalog: string
        areYouSureYouWantToActivateThisCatalog: string
        catalogs: string
        modify: string
        addNewCategory: string
        nameOfNewCategory: string
        nameOfTheCategoryCantBeEmpty: string
        removeTheCategoryQuestion: string
        areYouSureYouWantToRemoveThisCategory: string
        cantRemoveCategoryAsItStillContainsQuestions: string
        addNewQuestion: string
        subject: string
        subjectCantBeEmpty: string
        descriptionCantBeEmpty: string
        typeOfQuestion: string
        competenceSlashMotivation: string
        customScaleHeadlines: string
        start: string
        middle: string
        end: string
        category: string
        deleteTheQuestion: string
        areYouSureYouWantToDeleteThisQuestion: string
        subjectOfTheNewQuestion: string
        noQuestionsInThisCategoryYet: string
        noCategoriesInThisCatalogYet: string
        copyCatalog: string
        copy: string
      }
      downloadCatalogs: {
        description: string
        catalog: string
        created: string
        downloadFailedIsTheCatalogEmpty: string
        download: string
      }
    }
    superAdmin: {
      identifierAttribute: string
      editOrganizations: {
        description: string
        id: string
        addOrganization: string
        removeOrganization: string
        areYouSureYouWantToRemoveTheOrganization: string
        addNewOrganization: string
        idCantBeEmpty: string
        identifierAttributeCantBeEmpty: string
      }
      editSuperAdministrators: {
        description: string
      }
      editOrganizationAdministrators: {
        description: string
      }
    }
    adminApi: {
      result: {
        removedUserFromGroup: string
        addedUserToGroup: string
      }
      error: {
        couldNotRemoveUserFromGroup: string
        couldNotAddUserToGroup: string
        couldNotGetAListOfUsersInGroup: string
        couldNotGetAListOfAllUsers: string
      }
    }
    catalogApi: {
      couldNotGetAListOfAllFormDefinitionsForOrganizationID: string
      listAllFormDefinitionsByOrganizationIDError: string
      couldNotGetAListOfCategoriesForFormDefinitionID: string
      couldNotGetAListOfQuestionsForCategoryID: string
      couldNotUpdateCategoryWithID: string
      couldNotUpdateQuestionWithID: string
      couldNotUpdateFormDefinitionWithID: string
      couldNotDeleteFormDefinitionWithID: string
      couldNotDeleteCategoryWithID: string
      couldNotDeleteQuestionWithID: string
      couldNotCreateTheFormDefinition: string
      couldNotCreateTheCategory: string
      couldNotCreateTheQuestion: string
    }
    groupsApi: {
      couldNotGetMembersOfGroupWithID: string
      couldNotGetAListOfAllGroups: string
      couldNotGetAListOfAllUsers: string
      couldNotAddUserWithIDToGroupWithID: string
      couldNotUpdateUserWithIDToGroupWithID: string
      couldNotRemoveUserWithIDFromGroupWithID: string
      couldNotAddAGroup: string
      couldNotRemoveGroupWithID: string
      couldNotSetGroupLeaderToUsernameOnGroupWithID: string
    }
    superAdminApi: {
      couldNotGetAListOfOrganizations: string
      couldNotAddTheOrganization: string
      couldNotDeleteTheOrganization: string
    }
    aria: {
      selectLanguageLanguageIsSelected: string
      helpButton: string
      toggleDropdownMenu: string
      menu: string
    }
  }
}
