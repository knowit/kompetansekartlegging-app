import { LanguageSchema } from '../schema'

export const English: LanguageSchema = {
  translation: {
    confirm: 'Confirm',
    abort: 'Abort',
    add: 'Add',
    remove: 'Remove',
    save: 'Save',
    answer: 'Answer',
    notAnswered: 'Not answered',
    competence: 'Competence',
    motivation: 'Motivation',
    scaleDescription: 'Scale description',
    errorOccured: 'An error occured: ',
    thisIsATestEnvironment: 'This is a test environment!',
    close: 'Close',
    employee: 'Employee',
    email: 'Email',
    groupLeader: 'Group leader',
    administrator: 'Administrator',
    username: 'Username',
    name: 'Name',
    description: 'Description',
    organizationID: 'Organization ID',
    groupDefiniteForm: 'group',
    roleDefiniteForm: ' role',
    searchForEmployeeInOrganization: 'Search for employee in {{organization}}',
    searchForEmployeeAcrossOrganizations:
      'Search for employee across organizations',
    nameCantBeEmpty: "Name can't be empty.",
    addAdministrator: 'Add administrator',
    pressHereToSeeWhatTheIconsMean: 'Press here to see what the icons mean',
    noOrganizationNameFound: 'No organization name found',
    noOrganizationFound: 'No organization found',
    errorWhileFetchingUpdatedAtFromLatestUserForm:
      'Error while fetching updatedAt from latest UserForm',
    login: {
      competenceMapping: 'Competence Mapping',
      signIn: 'Sign in',
      devSignIn: 'Dev login',
      enterYourEmail: 'Enter your Email',
      password: 'Password',
      enterYourPassword: 'Enter your Password',
      forgotYourPassword: 'Forgot your password?',
      userDoesNotExist: 'User does not exist.',
    },
    createAccount: {
      enterYourName: 'Enter your Name',
      confirmPassword: 'Confirm Password',
      pleaseConfirmYourPassword: 'Please confirm your Password',
      createAccount: 'Create Account',
      passwordCantBeEmpty: "Password can't be empty",
      weEmailedYou: 'We Emailed You',
      yourCodeIsOnTheWay:
        'Your code is on the way. To log in, enter the code we emailed to',
      itMayTakeAMinuteToArrive: 'It may take a minute to arrive',
      confirmationCode: 'Confirmation Code',
      resendCode: 'Resend Code',
      enterYourCode: 'Enter your code',
      confirmationCodeCantBeEmpty: "Confirmation code can't be empty",
      userAlreadyExists: 'User already exists',
      creatingAccount: 'Creating account',
      confirming: 'Confirming',
    },
    resetPassword: {
      resetPassword: 'Reset Password',
      enterYourEmail: 'Enter your email',
      sendCode: 'Send code',
      backToSignIn: 'Back to Sign In',
      sending: 'Sending',
      submit: 'Submit',
      submitting: 'Submitting',
      code: 'Code',
      newPassword: 'New Password',
      yourPasswordsMustMatch: 'Your passwords must match',
    },
    menu: {
      overview: 'Overview',
      myAnswers: 'My answers',
      myGroup: 'My group',
      admin: 'Admin',
      superAdmin: 'Super-admin',
      submenu: {
        editGroupLeaders: 'Edit group leaders',
        editGroups: 'Edit groups',
        editAdministrators: 'Edit administrators',
        editCatalogs: 'Edit catalogs',
        downloadCatalogs: 'Download catalogs',
        editOrganizations: 'Edit organizations',
        editSuperAdministrators: 'Edit super-administrators',
      },
    },
    navbar: {
      help: 'Help',
      signOut: 'Sign out',
      competenceMappingFor: 'Competence Mapping for',
      doYouWantToDeleteYourAnswers: 'Do you want to delete your answers?',
      thisWillDeleteAllAnswers:
        'N.B. This will delete all submitted and saved answers!',
      profilePicture: 'Profile Picture',
    },
    content: {
      unAnswered: 'Unanswered!',
      notAnswered: 'Not answered',
      notDefined: 'Not defined',
      answerHistory: 'Answer history',
      shouldBeUpdatedLastAnswered: 'Should be updated! Last answered: {{date}}',
      answerOutdatedOrIncomplete: 'The answer is outdated or incomplete!',
      unansweredOrOutdatedQuestionsInCategory:
        'Unanswered or outdated questions in category',
    },
    alertDialog: {
      nbAnswersNotSaved: 'N.B. Your answers are not saved.',
      leavingWillDiscardChanges: 'Leaving this form will discard your changes.',
      leaveForm: 'Leave form',
      stayOnForm: 'Stay on form',
    },
    overview: {
      yourTopAmbitionsWillBeDisplayedHere:
        'Your top ambitions will be displayed here',
      yourTopStrengthsWillBeDisplayedHere:
        'Your top strengths will be displayed here',
      focusAreas: 'Focus areas',
      topStrengths: 'Top strengths',
      topAmbitions: 'Top ambitions',
      overviewType: {
        average: 'Avg',
        median: 'Median',
        highest: 'Top',
      },
    },
    competenceScale: {
      competenceScale: 'Competence scale',
      superstar: 'Superstar',
      expert: 'Expert',
      professional: 'Professional level',
      potentiallyUsable: 'Potentially usable competence',
      someInsight: 'Some insight',
      unfamiliar: 'Unfamiliar area',
      description: {
        superstar:
          'A sought-after specialist, who acts as an innovative or strategic force in the area',
        expert:
          'Has particularly good control and an established potition in the area',
        professional:
          'Has good control and can work independently on non-trivial issues within the area',
        potentiallyUsable:
          'Competence that has either not been tested in assignments or where support from others in the team is currently needed',
        someInsight:
          'Has some insight into the area, as well as the ability to reason about or solve tasks on a non-professional level within the area',
      },
    },
    motivationScale: {
      motivationScale: 'Motivation scale',
      enthusiast: 'Enthusiast. I am passionate about this.',
      good: 'Good. This is what I want to work on.',
      curious: 'Curious. I want to learn more about this.',
      ish: "Hm... I can if it's needed.",
      neutral: 'Neutral. No opinion.',
      no: 'No. I do not want to work on this.',
    },
    myAnswers: {
      fillOut: 'Fill out',
      blockHasNotBeenCompleted: 'The block has not been completed!',
      minutes: 'minutes',
      days: 'days',
      itHasBeenTimeSinceTheBlockWasUpdated:
        'It has been {{time}} since the block was updated!',
      theBlockWasLastUpdatedDate: 'The block was last updated {{date}}',
      submitAnswersAndQuit: 'Submit answers and quit',
      saveAndContinue: 'Save and continue',
      changeAnswers: 'Change answers',
    },
    myGroup: {
      lastAnswered: 'Last answered',
      removeFromGroup: 'Remove from group',
      addMembers: 'Add members',
      theEmployeeMustHaveSignedInOnce:
        'The employee must have signed into the app at least once.',
      showOnlyEmployeesWithoutGroupLeader:
        'Show only employees without a group leader',
      noGroupLeader: 'No group leader',
    },
    admin: {
      areYouSureYouWantToDeleteNameFromRole:
        'Are you sure you want to delete {{name}} from the {{role}}?',
      removeNameFromRole: 'Remove {{name}} from the {{role}}?',
      editGroupLeaders: {
        description:
          "Group leaders can access their group members' answers. They can also choose their group members. On this page you can add and remove group leaders.",
        addGroupLeader: 'Add group leader',
        rememberToReplaceGroupLeader:
          'Remember to add a new group leader to the groups the user was responsible for.',
      },
      editGroups: {
        description:
          'A group consists of a group leader and multiple group children. On this page you can add new groups, delete groups, change the leader of a group and add or remove group members.',
        chooseGroupLeaderForTheNewGroup:
          'Choose group leader for the new group',
        chooseNewGroupLeader: 'Choose new group leader',
        choose: 'Choose',
        createNewGroup: 'Create new group',
        createGroup: 'Create group',
        groupLeaderRemoved: 'Group leader removed',
        removeGroup: 'Remove group',
        removeGroupQuestion: 'Remove group?',
        areYouSureYouWantToRemoveTheGroup:
          'Are you sure you want to remove the group?',
        members: 'Members',
        details: 'Details',
        numberOfGroupMembers: 'Number of groupmembers',
      },
      editAdmins: {
        description:
          "Administrators have access to everyone's answers. They can also appoint group leaders and administrators, and can create and remove groups. On this page you can add and remove administrators.",
        editAdministrators: 'Edit administrators',
      },
      editCatalogs: {
        description:
          'On this page you can create new catalogs, remove catalogs and modify existing catalogs, categories and questions.',
        createNewCatalog: 'Create new catalog',
        lastUpdated: 'Last updated',
        notSet: 'Not set',
        activate: 'Activate',
        activateCatalog: 'Activate catalog',
        activateCatalogQuestion: 'Activate catalog?',
        modifyCatalog: 'Modify catalog',
        removeCatalog: 'Remove catalog',
        removeCatalogQuestion: 'Remove catalog?',
        areYouSureYouWantToRemoveThisCatalog:
          'Are you sure you want to remove this catalog? This will not delete the answers of the employees, but it will make it difficult to connect answers to set of questions.',
        nameOfNewCatalog: 'Name of new catalog',
        areYouSureYouWantToActivateThisCatalog:
          'Are you sure you want to activate this catalog? This will change the set of questions the employees answer.',
        catalogs: 'Catalogs',
        modify: 'Modify',
        addNewCategory: 'Add new category',
        nameOfNewCategory: 'Name of new category',
        nameOfTheCategoryCantBeEmpty: "Name of the category can't be empty",
        removeTheCategoryQuestion: "Remove the category '{{categoryName}}'?",
        areYouSureYouWantToRemoveThisCategory:
          'Are you sure you want to delete this category?',
        cantRemoveCategoryAsItStillContainsQuestions:
          "Can't remove the category as it still contains questions.",
        addNewQuestion: 'Add new question',
        subject: 'Subject',
        subjectCantBeEmpty: "Subject can't be empty.",
        descriptionCantBeEmpty: "Description can't be empty.",
        typeOfQuestion: 'Type of question',
        competenceSlashMotivation: 'Competence / Motivation',
        customScaleHeadlines: 'Custom scale headlines',
        start: 'Start',
        middle: 'Middle',
        end: 'End',
        category: 'Category',
        deleteTheQuestion: "Remove the question '{{question}}'?",
        areYouSureYouWantToDeleteThisQuestion:
          'Are you sure you want to remove this question? This action is irreversible. Answers to this question will no longer be connected to this question.',
        subjectOfTheNewQuestion: 'Subject of the new question',
        noQuestionsInThisCategoryYet:
          'There are no questions in this category yet.',
        noCategoriesInThisCatalogYet:
          'There are no catagories in this catalog yet.',
        copyCatalog: 'Copy catalog',
        copy: 'Copy',
      },
      downloadCatalogs: {
        description:
          'On this page you can download Excel-reports from the catalog of your choice.',
        catalog: 'Catalog',
        created: 'Created',
        downloadFailedIsTheCatalogEmpty:
          'Download failed.\nIs the catalog empty?',
        download: 'Download',
      },
    },
    superAdmin: {
      identifierAttribute: 'Identifier Attribute',
      editOrganizations: {
        description:
          'On this page you can add, remove and update organizations.',
        id: 'ID',
        adminEmail: 'Admin Email',
        addOrganization: 'Add organization',
        removeOrganization: "Remove organization '{{organization}}'?",
        areYouSureYouWantToRemoveTheOrganization:
          "Are you sure you want to remove the organization '{{organization}}'?",
        addNewOrganization: 'Add new organization',
        idCantBeEmptyOrContainZero: "ID can't be empty or contain '0'.",
        identifierAttributeCantBeEmpty: "Identifier attribute can't be empty.",
        adminEmailIsInvalid: 'Admin email is invalid.',
      },
      editSuperAdministrators: {
        description:
          'On this page you can add and remove super-administrators.',
        superAdministrator: 'Super-administrator',
        addSuperAdministrator: 'Add super-administrator',
      },
      editOrganizationAdministrators: {
        description:
          'On this page you can add and remove administrators for specific organizations.',
      },
    },
    adminApi: {
      result: {
        removedUserFromGroup: "Removed '{{username}}' from '{{groupname}}'.",
        addedUserToGroup: "Added '{{username}}' to '{{groupname}}'.",
      },
      error: {
        couldNotRemoveUserFromGroup:
          "Could not remove user '{{username}}' from group '{{groupname}}'.",
        couldNotAddUserToGroup:
          "Could not add user '{{username}}' to group '{{groupname}}'.",
        couldNotGetAListOfUsersInGroup:
          "Could not get a list of users in group '{{groupname}}'.",
        couldNotGetAListOfAllUsers: 'Could not get a list of all users.',
      },
    },
    catalogApi: {
      couldNotGetAListOfAllFormDefinitionsForOrganizationID:
        "Could not get a list of all catalogs for organization with ID '{{organizationID}}'.",
      listAllFormDefinitionsByOrganizationIDError:
        "listAllFormDefinitionsByOrganizationID: Could not get a list of all catalogs for organization with ID '{{organizationID}}'.",
      couldNotGetAListOfCategoriesForFormDefinitionID:
        "Could not get a list of categories for catalog with ID '{{formDefinitionID}}'.",
      couldNotGetAListOfQuestionsForCategoryID:
        "Could not get a list of questions for category with ID '{{categoryID}}'.",
      couldNotUpdateCategoryWithID:
        "Could not update category with ID '{{categoryID}}'.",
      couldNotUpdateQuestionWithID:
        "Could not update question with ID '{{questionID}}'.",
      couldNotUpdateFormDefinitionWithID:
        "Could not update catalog with ID '{{formDefinitionID}}'.",
      couldNotDeleteFormDefinitionWithID:
        "Could not delete catalog with ID '{{formDefinitionID}}'.",
      couldNotDeleteCategoryWithID:
        "Could not delete category with ID '{{categoryID}}'",
      couldNotDeleteQuestionWithID:
        "Could not delete question with ID '{{questionID}}'.",
      couldNotCreateTheFormDefinition:
        "Could not create the catalog '{{catalogName}}'.",
      couldNotCreateTheCategory:
        "Could not create the category '{{categoryName}}'.",
      couldNotCreateTheQuestion:
        "Could not create the question '{{question}}'.",
    },
    groupsApi: {
      couldNotGetMembersOfGroupWithID:
        "Could not get members of group with ID '{{groupID}}'.",
      couldNotGetAListOfAllGroups: 'Could not get a list of all groups.',
      couldNotGetAListOfAllUsers: 'Could not get a list of all users.',
      couldNotAddUserWithIDToGroupWithID:
        "Could not add user with ID '{{userID}}' to group with ID '{{groupID}}'.",
      couldNotUpdateUserWithIDToGroupWithID:
        "Could not update user with ID '{{userID}}' to group with ID '{{groupID}}'.",
      couldNotRemoveUserWithIDFromGroupWithID:
        "Could not remove user with ID '{{userID}}' from group with ID '{{groupID}}'.",
      couldNotAddAGroup: 'Could not add a group.',
      couldNotRemoveGroupWithID:
        "Could not remove group with ID '{{groupID}}'.",
      couldNotSetGroupLeaderToUsernameOnGroupWithID:
        "Could not set group leader to '{{username}}' on group with ID '{{groupID}}'.",
    },
    superAdminApi: {
      couldNotGetAListOfOrganizations: 'Could not get a list of organizations.',
      couldNotAddTheOrganization:
        "Could not add the organization '{{organizationName}}'.",
      couldNotDeleteTheOrganization:
        "Could not delete the organization '{{organizationName}}'.",
      theNewOrganizationWasNotProperlyConfigured:
        "The new organization '{{organizationName}}' was not properly configured.",
    },
    aria: {
      selectLanguageLanguageIsSelected:
        'select language, {{language}} is selected',
      helpButton: 'help button',
      toggleDropdownMenu: 'toggle dropdownmenu',
      menu: 'menu',
    },
  },
}
