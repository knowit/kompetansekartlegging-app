export type TranslationKeysSchema = {
  translation: {
    confirm: string
    abort: string
    remove: string
    notAnswered: string
    knowledge: string
    motivation: string
    scaleDescription: string
    errorOccured: string
    thisIsATestEnvironment: string
    close: string
    employee: string
    email: string
    add: string
    groupLeader: string
    username: string
    theGroup: string
    theRole: string
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
      searchForEmployeeIn: string
      theEmployeeMustHaveSignedInOnce: string
      showOnlyEmployeesWithoutGroupLeader: string
      noGroupLeader: string
    }
    admin: {
      areYouSureYouWantToDeleteNameFromRole: string
      removeNameFromRole: string
      searchForEmployeeInOrganization: string
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
        groupLeaderRemoved: string
        removeGroup: string
        members: string
        details: string
        numberOfGroupMembers: string
      }
      editAdmins: {
        editAdministrators: string
        description: string
        addAdministrator: string
      }
    }
  }
}
