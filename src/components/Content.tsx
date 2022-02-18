import React, { Fragment, useEffect, useState } from "react";
import {
    Panel,
    ContentProps,
    FormDefinition,
    UserAnswer,
    UserFormWithAnswers,
    CreateQuestionAnswerResult,
    AlertState,
    Alert,
    QuestionAnswer,
    SliderValues,
    UserRole,
} from "../types";
import * as helper from "../helperFunctions";
import * as customQueries from "../graphql/custom-queries";
import { Overview } from "./cards/Overview";
import { YourAnswers } from "./cards/YourAnswers";
import { CreateQuestionAnswerInput, QuestionType } from "../API";
import { Button, ListItem, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { KnowitColors } from "../styles";
import { AlertDialog } from "./AlertDialog";
import {
    AlertNotification,
    AlertType,
    staleAnswersLimit,
} from "./AlertNotification";
import NavBarMobile from "./NavBarMobile";
import { AnswerHistory } from "./AnswerHistory";
import { AdminPanel, AdminMenu } from "./AdminPanel/";
import { GroupLeaderMenu, GroupLeaderPanel } from "./GroupLeaderPanel/";
import {
    getUserAnswers,
    fetchLastFormDefinition,
    createQuestionAnswers,
    setFirstAnswers,
} from "./answersApi";
import {useSelector} from 'react-redux';
import { selectUserState, selectIsSuperAdmin ,selectIsAdmin, selectIsGroupLeader, 
     selectAdminCognitoGroupName, selectGroupLeaderCognitoGroupName } from "../redux/User";
import { SuperAdminMenu } from "./SuperAdminPanel/SuperAdminMenu";
import { SuperAdminPanel } from "./SuperAdminPanel/SuperAdminPanel";

const cardCornerRadius: number = 40;

export enum MenuButton {
    Overview,
    MyAnswers,
    Category,
    GroupLeader,
    LeaderCategory,
    Other,
}

export const contentStyleDesktop = makeStyles({
    cardHolder: {
        display: "flex",
        flexDirection: "column",
        // overflow: 'hidden',
        height: "100%",
    },
});

export const contentStyleMobile = makeStyles({
    contentContainer: {
        display: "flex",
        flexDirection: "column",
        // overflowY: 'scroll',
        overflowX: "hidden",
        height: "100%",
    },
    panel: {
        background: KnowitColors.white,
        height: "100%",
        width: "100%",
        marginTop: 56,
    },
});

const contentStyle = makeStyles({
    contentContainer: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
    },
    menu: {
        background: KnowitColors.beige,
        width: "20%",
        height: "max-content",
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 20,
        display: "flex",
        flexDirection: "column",
        borderRadius: "0px 0px 30px 0px",
        boxShadow: "0px 4px 4px rgb(0 0 0 / 15%)",
        zIndex: 1,
    },
    MenuButton: {
        borderRadius: `${cardCornerRadius}px 0 0 ${cardCornerRadius}px`,
        "&:hover": {
            background: KnowitColors.white,
        },
        textTransform: "none",
    },
    menuButtonActive: {
        background: KnowitColors.white,
        marginRight: -2,
    },
    menuButtonText: {
        fontSize: 15,
        textAlign: "left",
        width: "100%",
        marginLeft: 10,
        fontWeight: "bold",
        display: "flex",
        color: KnowitColors.darkBrown,
    },
    menuButtonCategoryText: {
        fontSize: 12,
        marginLeft: 20,
        display: "flex",
    },
    hideCategoryButtons: {
        display: "none",
    },
    panel: {
        background: KnowitColors.white,
        height: "100%",
        width: "80%",
    },
});

const updateCategoryAlerts = (
    questionAnswers: Map<string, QuestionAnswer[]>,
    setAlerts: React.Dispatch<React.SetStateAction<AlertState | undefined>>
) => {
    let msNow = Date.now();
    let alerts = new Map<string, Alert>();
    let catAlerts = new Map<string, number>();
    questionAnswers.forEach((quAnsArr) => {
        quAnsArr.forEach((quAns) => {
            if (
                (quAns.question.type !== QuestionType.customScaleLabels &&
                    (quAns.motivation === -1 || quAns.knowledge === -1)) ||
                (quAns.question.type === QuestionType.customScaleLabels &&
                    quAns.customScaleValue === -1)
            ) {
                alerts.set(quAns.question.id, {
                    type: AlertType.Incomplete,
                    message: "Ubesvart!",
                });
                let numAlerts = catAlerts.get(quAns.question.category.text);
                if (numAlerts)
                    catAlerts.set(quAns.question.category.text, numAlerts + 1);
                else catAlerts.set(quAns.question.category.text, 1);
            } else if (msNow - quAns.updatedAt > staleAnswersLimit) {
                alerts.set(quAns.question.id, {
                    type: AlertType.Outdated,
                    message: `Bør oppdateres! Sist besvart: ${
                        new Date(quAns.updatedAt) //.toLocaleDateString('no-NO')
                    }`,
                });
                let numAlerts = catAlerts.get(quAns.question.category.text);
                if (numAlerts)
                    catAlerts.set(quAns.question.category.text, numAlerts + 1);
                else catAlerts.set(quAns.question.category.text, 1);
            }
        });
    });
    setAlerts({ qidMap: alerts, categoryMap: catAlerts });
};

const Content = ({ ...props }: ContentProps) => {

    const userState = useSelector(selectUserState);
    const adminCognitoGroupName = useSelector(selectAdminCognitoGroupName);
    const groupLeaderCognitoGroupName = useSelector(selectGroupLeaderCognitoGroupName);

    const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(
        null
    );
    const [, setUserAnswers] = useState<UserAnswer[]>([]); //Used only for getting data on load
    const [userAnswersLoaded, setUserAnswersLoaded] = useState(false);
    // const [submitFeedback, setSubmitFeedback] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);
    const [questionAnswers, setQuestionAnswers] = useState<
        Map<string, QuestionAnswer[]>
    >(new Map());
    // const [answersBeforeSubmitted, setAnswersBeforeSubmitted] = useState<AnswerData[]>([]);
    const [answersBeforeSubmitted, setAnswersBeforeSubmitted] = useState<
        Map<string, QuestionAnswer[]>
    >(new Map());
    // const [historyViewOpen, setHistoryViewOpen] = useState<boolean>(false);
    const [answerLog, setAnswerLog] = useState<UserFormWithAnswers[]>([]);
    const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);
    const [isCategorySubmitted, setIsCategorySubmitted] = useState<boolean>(
        true
    );
    const [activePanel, setActivePanel] = useState<Panel>(Panel.Overview);
    const [activeCategory, setActiveCategory] = useState<string>("dkjfgdrjkg");
    const [answerEditMode, setAnswerEditMode] = useState<boolean>(false);
    const [alerts, setAlerts] = useState<AlertState>();
    const [activeSubmenuItem, setActiveSubmenuItem] = useState<string>("");

    const updateAnswer = (
        category: string,
        sliderMap: Map<string, SliderValues>
    ): void => {
        let newAnswers: QuestionAnswer[] =
            questionAnswers.get(category)?.map((quAns) => {
                let sliderValues = sliderMap.get(
                    quAns.question.id
                ) as QuestionAnswer;
                if (sliderValues.customScaleValue) {
                    return {
                        ...quAns,
                        customScaleValue: sliderValues
                            ? sliderValues.customScaleValue
                            : -2,
                        updatedAt: Date.now(),
                    };
                }
                return {
                    ...quAns,
                    knowledge: sliderValues ? sliderValues.knowledge : -2, //If is -2, something is wrong
                    motivation: sliderValues ? sliderValues.motivation : -2,
                    updatedAt: Date.now(),
                };
            }) || [];
        setQuestionAnswers(new Map(questionAnswers.set(category, newAnswers)));
    };

    const createUserForm = async () => {
        setIsCategorySubmitted(true);
        setAnswersBeforeSubmitted(new Map(questionAnswers));
        setAnswerEditMode(false);
        if (!formDefinition) {
            console.error("Missing formDefinition!");
            return;
        }
        let quAnsInput: CreateQuestionAnswerInput[] = [];
        questionAnswers.get(activeCategory)?.forEach((quAns) => {
            if (
                quAns.question.type === QuestionType.customScaleLabels &&
                quAns.customScaleValue !== -1
            ) {
                quAnsInput.push({
                    userFormID: "",
                    questionID: quAns.question.id,
                    customScaleValue: quAns.customScaleValue,
                    formDefinitionID: formDefinition.id.toString(),
                    orgAdmins: adminCognitoGroupName,
                    orgGroupLeaders: groupLeaderCognitoGroupName
                });
                return;
            }

            if (quAns.knowledge < 0 && quAns.motivation < 0) return;
            quAnsInput.push({
                userFormID: "",
                questionID: quAns.question.id,
                knowledge: quAns.knowledge,
                motivation: quAns.motivation,
                formDefinitionID: formDefinition.id.toString(),
                orgAdmins: adminCognitoGroupName,
                orgGroupLeaders: groupLeaderCognitoGroupName
            });
        });
        if (quAnsInput.length === 0) {
            console.error(
                "Error finding active category when creating userform"
            );
            return;
        }
        let result = (
            await helper.callBatchGraphQL<CreateQuestionAnswerResult>(
                customQueries.batchCreateQuestionAnswer2,
                { input: quAnsInput, organizationID: userState.organizationID },
                "QuestionAnswer"
            )
        ).map((result) => result.data?.batchCreateQuestionAnswer);
        // console.log("Result: ", result);
        if (!result || result.length === 0) {
            return;
        }
    };

    const changeActiveCategory = (newActiveCategory: string) => {
        setActiveCategory(newActiveCategory);
        setAnswerEditMode(false);
    };

    const resetAnswers = () => {
        // setAnswers(JSON.parse(JSON.stringify(answersBeforeSubmitted))) // json.parse to deep copy
        setQuestionAnswers(new Map(answersBeforeSubmitted));
    };

    const submitAndProceed = () => {
        createUserForm();
        let currentIndex = categories.findIndex(
            (cat) => cat === activeCategory
        );
        if (categories.length >= currentIndex) {
            changeActiveCategory(categories[currentIndex + 1]);
            setAnswerEditMode(true);
        }
    };

    useEffect(() => {
        setActiveCategory(categories[0]);
        // setAnswerEditMode(false);
    }, [categories]);

    useEffect(() => {
        updateCategoryAlerts(questionAnswers, setAlerts);
    }, [questionAnswers]);

    useEffect(() => {
        // console.log('fetchLastFormDefitniio');
        fetchLastFormDefinition(
            setFormDefinition,
            (formDef) => createQuestionAnswers(formDef, setCategories),
            (formDef) =>
                getUserAnswers(
                    formDef,
                    userState.userName,
                    setUserAnswers,
                    setActivePanel,
                    setUserAnswersLoaded,
                    setAnswerEditMode,
                    props.setFirstTimeLogin,
                    props.setScaleDescOpen,
                    props.isMobile
                ),
            (quAns, newUserAnswers) =>
                setFirstAnswers(
                    quAns,
                    newUserAnswers,
                    setQuestionAnswers,
                    setAnswersBeforeSubmitted
                )
        );
    }, [
        userState,
        props.setFirstTimeLogin,
        props.setScaleDescOpen,
        props.isMobile,
    ]);

    useEffect(() => {
        setAnswersBeforeSubmitted(new Map(questionAnswers));
    }, [questionAnswers]);

    const { answerHistoryOpen, setAnswerHistoryOpen } = props;
    useEffect(() => {
        const fetchUserFormsAndOpenView = async () => {
            // debugger
            let allUserForms = await helper.listUserForms();
            setAnswerLog(allUserForms);
            setAnswerHistoryOpen(true);
        };

        if (answerHistoryOpen) {
            fetchUserFormsAndOpenView();
        } else {
            setAnswerHistoryOpen(false);
        }
    }, [answerHistoryOpen, setAnswerHistoryOpen]);

    useEffect(() => {
        window.onbeforeunload = confirmExit;
        function confirmExit() {
            if (!isCategorySubmitted) {
                return "show warning";
            }
        }
    }, [isCategorySubmitted]);

    const [lastButtonClicked, setLastButtonClicked] = useState<{
        buttonType: MenuButton;
        category?: string;
    }>({
        //Custom type might better be moved to type variable
        buttonType: MenuButton.Overview,
        category: undefined,
    });

    const style = contentStyle();
    const mobileStyle = contentStyleMobile();

    //TODO: Remove this function when refactor is done. Needed to not change mobile too much for now
    const dummyFunctionForRefactor = () => {
        return;
    };

    const checkIfCategoryIsSubmitted = (
        buttonType: MenuButton,
        category?: string
    ) => {
        if (isCategorySubmitted) {
            menuButtonClicked(buttonType, category);
        } else {
            setLastButtonClicked({
                buttonType: buttonType,
                category: category,
            });
            setAlertDialogOpen(true);
        }
    };

    const leaveFormButtonClicked = () => {
        setAnswerEditMode(false);
        setAlertDialogOpen(false);
        setIsCategorySubmitted(true);
        resetAnswers();
        menuButtonClicked(
            lastButtonClicked.buttonType,
            lastButtonClicked.category
        );
    };

    const menuButtonClicked = (buttonType: MenuButton, category?: string) => {
        props.setShowFab(true);
        switch (buttonType) {
            case MenuButton.Overview:
                setActivePanel(Panel.Overview);
                break;
            case MenuButton.MyAnswers:
                setActivePanel(Panel.MyAnswers);
                if (category) setActiveCategory(category);
                break;
            case MenuButton.Category:
                setActiveCategory(category || "");
                setAnswerEditMode(false);
                break;
            case MenuButton.Other:
                setActivePanel(Panel.Other);
                console.log("Other button pressed", category);
                break;
        }
    };

    const keepButtonActive = (buttonType: MenuButton): string => {
        switch (buttonType) {
            case MenuButton.Overview:
                return activePanel === Panel.Overview
                    ? style.menuButtonActive
                    : "";
            case MenuButton.MyAnswers:
                return activePanel === Panel.MyAnswers
                    ? style.menuButtonActive
                    : "";
            case MenuButton.GroupLeader:
                return activePanel === Panel.GroupLeader
                    ? style.menuButtonActive
                    : "";
        }
        return "";
    };

    const getMainMenuAlertElement = (): JSX.Element => {
        let totalAlerts = alerts?.qidMap.size ?? 0;
        if (totalAlerts > 0)
            return (
                <AlertNotification
                    type={AlertType.Multiple}
                    message="Besvarelsen er utdatert eller ikke komplett!"
                    size={0}
                />
            );
        else return <Fragment />;
    };

    <AlertNotification
        type={AlertType.Multiple}
        message="Besvarelsen er utdatert eller ikke komplett!"
        size={0}
    />;

    /**
     *  Setup for the button array structure:
     *
     *  text: string - The text on the button
     *  buttonType: MenuButton - The type of button it is
     *  subButtons: Array of Objects - Only define if having sub buttons (like categories for answers)
     *      subButton's Objects: text: string - The tet of the button (index is added in front automaticly)
     *                           buttonType: MenuButton - The type of button it is, not same as 'parent'
     *                           activePanel: Panel - What panel is needed to be active for this button to show up
     *
     *  NOTE: Active panel should be changed somehow to instead check if parent button is active or not
     */
    const isSuperAdmin = useSelector(selectIsSuperAdmin);
    const isAdmin = useSelector(selectIsAdmin);
    const isGroupLeader = useSelector(selectIsGroupLeader);

    const buttonSetup = [
        { text: "OVERSIKT", buttonType: MenuButton.Overview, show: true },
        {
            text: "MINE SVAR",
            buttonType: MenuButton.MyAnswers,
            subButtons: categories.map((cat) => {
                return {
                    text: cat,
                    buttonType: MenuButton.Category,
                    activePanel: Panel.MyAnswers,
                };
            }),
            show: true,
        },
    ];

    const setupDesktopMenu = (): JSX.Element[] => {
        let buttons: JSX.Element[] = [];
        buttonSetup
            .filter((b) => b.show)
            .forEach((butt) => {
                buttons.push(
                    <Button
                        key={butt.text}
                        className={clsx(
                            style.MenuButton,
                            keepButtonActive(butt.buttonType)
                        )}
                        onClick={() => {
                            checkIfCategoryIsSubmitted(
                                butt.buttonType,
                                undefined
                            );
                        }}
                    >
                        <div className={clsx(style.menuButtonText)}>
                            {butt.text}
                            {butt.buttonType === MenuButton.MyAnswers
                                ? getMainMenuAlertElement()
                                : ""}
                        </div>
                    </Button>
                );
                if (butt.subButtons) {
                    butt.subButtons.forEach((butt, index) => {
                        buttons.push(
                            <Button
                                key={butt.text}
                                className={clsx(
                                    style.MenuButton,
                                    activeCategory === butt.text
                                        ? style.menuButtonActive
                                        : "",
                                    activePanel === butt.activePanel
                                        ? ""
                                        : style.hideCategoryButtons
                                )}
                                onClick={() => {
                                    checkIfCategoryIsSubmitted(
                                        butt.buttonType,
                                        butt.text
                                    );
                                }}
                            >
                                <div
                                    className={clsx(
                                        style.menuButtonText,
                                        style.menuButtonCategoryText
                                    )}
                                >
                                    {index + 1}. {butt.text}
                                    {alerts?.categoryMap.has(butt.text) ? (
                                        <AlertNotification
                                            type={AlertType.Multiple}
                                            message="Ikke besvart eller utdaterte spørsmål i kategori"
                                            size={alerts.categoryMap.get(
                                                butt.text
                                            )}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </Button>
                        );
                    });
                }
            });

        return buttons;
    };

    const setUpMobileMenu = () => {
        let listItems: JSX.Element[] = [];

        buttonSetup.forEach((butt) => {
            listItems.push(
                <ListItem
                    key={butt.text}
                    onClick={() => {
                        checkIfCategoryIsSubmitted(butt.buttonType, undefined);
                    }}
                >
                    {butt.text}
                    {butt.buttonType === MenuButton.MyAnswers
                        ? getMainMenuAlertElement()
                        : ""}
                </ListItem>
            );
        });

        return listItems;
    };

    const enableAnswerEditMode = () => {
        setAnswersBeforeSubmitted(new Map(questionAnswers));
        setAnswerEditMode(true);
    };

    const [groupMembers, setGroupMembers] = useState<any>([]);
    const setupPanel = (): JSX.Element => {
        switch (activePanel) {
            case Panel.Overview:
                return (
                    <Overview
                        activePanel={activePanel}
                        questionAnswers={questionAnswers}
                        categories={categories}
                        isMobile={props.isMobile}
                        userAnswersLoaded={userAnswersLoaded}
                    />
                );
            case Panel.MyAnswers:
                return (
                    <YourAnswers
                        activePanel={activePanel}
                        setIsCategorySubmitted={setIsCategorySubmitted}
                        createUserForm={createUserForm}
                        submitAndProceed={submitAndProceed}
                        updateAnswer={updateAnswer}
                        formDefinition={formDefinition}
                        questionAnswers={questionAnswers}
                        changeActiveCategory={changeActiveCategory}
                        categories={categories}
                        activeCategory={activeCategory}
                        enableAnswerEditMode={enableAnswerEditMode}
                        answerEditMode={answerEditMode}
                        isMobile={props.isMobile}
                        alerts={alerts}
                        checkIfCategoryIsSubmitted={checkIfCategoryIsSubmitted}
                        collapseMobileCategories={
                            props.collapseMobileCategories
                        }
                        categoryNavRef={props.categoryNavRef}
                        scrollToTop={props.scrollToTop}
                        setCollapseMobileCategories={
                            props.setCollapseMobileCategories
                        }
                    />
                );
            case Panel.GroupLeader:
                return (
                    <GroupLeaderPanel
                        setActiveSubmenuItem={setActiveSubmenuItem}
                        activeSubmenuItem={activeSubmenuItem}
                        members={groupMembers}
                        setMembers={setGroupMembers}
                    />
                );
            case Panel.Admin:
                return <AdminPanel activeSubmenuItem={activeSubmenuItem} />;
            case Panel.SuperAdmin:
                return <SuperAdminPanel activeSubmenuItem={activeSubmenuItem} />;
            case Panel.Other:
                return <div>Hello! This is the "Other" panel :D</div>;
        }
        return <div>Not implemented</div>;
    };

    return (
        <div
            className={
                props.isMobile
                    ? mobileStyle.contentContainer
                    : style.contentContainer
            }
            ref={props.mobileNavRef}
        >
            {props.isMobile ? (
                <NavBarMobile
                    menuButtons={setUpMobileMenu()}
                    activePanel={activePanel}
                    signout={props.signout}
                />
            ) : (
                <div className={style.menu}>
                    {setupDesktopMenu()}
                    <GroupLeaderMenu
                        members={groupMembers}
                        show={isGroupLeader}
                        selected={activePanel === Panel.GroupLeader}
                        setActivePanel={setActivePanel}
                        setActiveSubmenuItem={setActiveSubmenuItem}
                        activeSubmenuItem={activeSubmenuItem}
                        setShowFab={props.setShowFab}
                        style={style}
                    />
                    <AdminMenu
                        show={isAdmin}
                        selected={activePanel === Panel.Admin}
                        setShowFab={props.setShowFab}
                        setActivePanel={setActivePanel}
                        setActiveSubmenuItem={setActiveSubmenuItem}
                        activeSubmenuItem={activeSubmenuItem}
                        style={style}
                    />
                    <SuperAdminMenu
                        show={isSuperAdmin}
                        selected={activePanel === Panel.SuperAdmin}
                        setShowFab={props.setShowFab}
                        setActivePanel={setActivePanel}
                        setActiveSubmenuItem={setActiveSubmenuItem}
                        activeSubmenuItem={activeSubmenuItem}
                        style={style}
                    />
                </div>
            )}
            <div className={props.isMobile ? mobileStyle.panel : style.panel}>
                {setupPanel()}
            </div>
            <AlertDialog
                setAlertDialogOpen={setAlertDialogOpen}
                alertDialogOpen={alertDialogOpen}
                changeActiveCategory={dummyFunctionForRefactor} //setActiveCategory}
                clickedCategory={activeCategory}
                setIsCategorySubmitted={setIsCategorySubmitted}
                resetAnswers={resetAnswers}
                leaveFormButtonClicked={leaveFormButtonClicked} //Temp added here, replace changeActiveCategory
                isMobile={props.isMobile}
            />
            <AnswerHistory
                history={answerLog}
                historyViewOpen={props.answerHistoryOpen}
                setHistoryViewOpen={props.setAnswerHistoryOpen}
                isMobile={props.isMobile}
            />
        </div>
    );
};

export default Content;
