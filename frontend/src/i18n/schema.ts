export type TranslationKeysSchema = {
  translation: {
    confirm: string
    abort: string
    add: string
    remove: string
    save: string
    notAnswered: string
    knowledge: string
    motivation: string
    scaleDescription: string
    errorOccured: string
    thisIsATestEnvironment: string
    close: string
    employee: string
    email: string
    groupLeader: string
    username: string
    name: string
    description: string
    theGroup: string
    theRole: string
    searchForEmployeeInOrganization: string
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
      knowledgeMappingFor: string
      doYouWantToDeleteYourAnswers: string
      thisWillDeleteAllAnswers: string
    }
    content: {
      unAnswared: string
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
    knowledgeScale: {
      knowledgeScale: string
      superstar: string
      expert: string
      professional: string
      potentiallyUsable: string
      someInsight: string
      unfamiliar: string
      desc: {
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
        addAdministrator: string
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
        nameCantBeEmpty: string
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
        knowledgeSlashMotivation: string
        customScaleHeadlines: string
        start: string
        middle: string
        end: string
        category: string
        deleteTheQuestion: string
        areYouSureYouWantToDeleteThisQuestion: string
        subjectOfTheNewQuestion: string
        noQuestionsInThisCategoryYet: string
      }
      downloadCatalogs: {
        description: string
        catalog: string
        created: string
        downloadFailedIsTheCatalogEmpty: string
        download: string
      }
    }
  }
}
