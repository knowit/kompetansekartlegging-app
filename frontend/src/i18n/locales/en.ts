import { TranslationKeysSchema } from "../schema";

export const English: TranslationKeysSchema = {
    translation: {
        confirm: "Confirm",
        abort: "Abort",
        remove: "Remove",
        notAnswered: "Not answered",
        knowledge: "Knowledge",
        motivation: "Motivation",
        scaleDescription: "Scale description",
        errorOccured: "An error occured: {{error}}",
        thisIsATestEnvironment: "N.B.: This is a test environment!",
        close: "CLOSE",
        employee: "Employee",
        email: "Email",
        add: "Add",
        groupLeader: "Group leader",
        username: "Username",
        theGroup: "group",
        theRole: " role",
        menu: {
            overview: "Overview",
            myAnswers: "My answers",
            myGroup: "My group",
            admin: "Admin",
            superAdmin: "Super-admin",
            submenu: {
                editGroupLeaders: "Edit group leaders",
                editGroups: "Edit groups",
                editAdministrators: "Edit administrators",
                editCatalogs: "Edit catalogs",
                editOrganizations: "Edit organizations",
                editSuperAdministrators: "Edit super-administrators",
                editOrganizationAdministrators: "Edit organization-administrators"
            }
        },
        navbar: {
            help: "Help",
            signOut: "Sign out",
            knowledgeMappingFor: "Knowledge mapping for",
            doYouWantToDeleteYourAnswers: "Do you want to delete your answers?",
            thisWillDeleteAllAnswers: "N.B. This will delete all submitted and saved answers!"
        },
        content: {
            unAnswared: "Unanswered!",
            shouldBeUpdatedLastAnswered: "Should be updated! Last answered: {{date}}",
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
        },
        myAnswers: {
            fillOut: "Fill out",
            blockHasNotBeenCompleted: "The block has not been completed!"
        },
        myGroup: {
            lastAnswered: "Last answered",
            removeFromGroup: "Remove from group",
            addMembers: "Add members",
            searchForEmployeeIn: "Search for employee in {{company}}",
            theEmployeeMustHaveSignedInOnce: "The employee must have signed into the app at least once.",
            showOnlyEmployeesWithoutGroupLeader: "Show only employees without a group leader",
            noGroupLeader: "No group leader"
        },
        admin: {
            areYouSureYouWantToDeleteNameFromRole: "Are you sure you want to delete {{name}} from the {{role}}?",
            removeNameFromRole: "Remove {{name}} from the {{role}}?",
            searchForEmployeeInOrganization: "Search for employee in {{organization}}",
            editGroupLeaders: {
                description: "Group leaders can access their group members' answers. They can also choose their group members. In this submenu, you can add and remove group leaders.",
                addGroupLeader: "Add group leader",
                rememberToReplaceGroupLeader: "Remember to add a new group leader for the groups the user was responsible for.",
            },
            editGroups: {
                description: "A group consists of a group leader and multiple group children. In this submenu, you can add new groups, delete groups, change the leader of a group and add or remove group members.",
                chooseGroupLeaderForTheNewGroup: "Choose group leader for the new group",
                chooseNewGroupLeader: "Choose new group leader",
                choose: "Choose",
                createNewGroup: "Create new group",
                groupLeaderRemoved: "Group leader removed",
                removeGroup: "Remove group",
                members: "Members",
                details: "Details",
                numberOfGroupMembers: "Number of groupmembers",
            },
            editAdmins: {
                editAdministrators: "Edit administrators",
                description: "Administrators have access to everyone's answers. They can also appoint group leaders and administrators, and can create and remove groups. In this submenu, you can add and remove administrators.",
                addAdministrator: "Add administrator"
            }
        }
    }
}
