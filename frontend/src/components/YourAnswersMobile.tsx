import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect } from "react";
import { KnowitColors } from "../styles";
import { YourAnswerProps, Panel } from "../types";
import AnswerDiagram from "./AnswerDiagram";
import { Form } from "./Form";
import { MenuButton } from "./Content";
import { AlertNotification, AlertType } from "./AlertNotification";
import ProgressBar from "./ProgressBar";
import { BlockInfo } from "./BlockInfo";

const yourAnswersStyleMobile = makeStyles({
    hidden: {
        display: "none",
    },
    answerBox: {
        // display: 'flex',
        flexDirection: "column",
        height: "100%",
        width: "100%",
    },
    answerBoxScrolled: {
        // display: 'flex',
        flexDirection: "column",
        height: "100%",
        width: "100%",
        marginTop: 20,
    },

    answerView: {
        marginRight: 10,
        marginLeft: 10,
        width: "95%",
        height: "100%",
        borderRadius: 10,
        background: KnowitColors.white,
        // position: 'absolute'
    },
    form: {
        width: "100%",
        // overflowY: 'auto',
        height: "100%",
    },
    categoryList: {
        height: "min-content",
        backgroundColor: KnowitColors.beige,
        paddingBottom: "18px",
        marginBottom: "8px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.15)",
        borderRadius: "0px 0px 50px 50px",
    },
    navigationContainer: {
        width: "100%",
        // position: 'fixed',
        // top: 56,
        // zIndex: 1
    },
    navigationContainerScrolled: {
        backgroundColor: "white",
        width: "100%",
        position: "fixed",
        top: 56,
        zIndex: 2,
    },
    categoryListInner: {
        // marginLeft: 10,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
    },
    categoryButton: {
        width: "100%",
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: KnowitColors.greyGreen,
        "&:hover": {
            background: KnowitColors.white,
        },
        justifyContent: "left",
    },
    catHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    graphHolder: {
        width: "100%",
        height: "60%",
        // borderRadius: 10,
        // background: KnowitColors.creme,
    },
    editButton: {
        width: "25%",
        fontWeight: "bold",
        fontSize: "12px",
        margin: 5,
        padding: 10,
        borderRadius: 18,
        color: KnowitColors.darkBrown,
        background: KnowitColors.lightGreen,
        "&:hover": {
            color: KnowitColors.darkGreen,
        },
        textTransform: "none",
    },
    catText: {
        width: "80%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: 18,
    },
    buttonText: {
        textTransform: "none",
        textAlign: "left",
        justifyContent: "left",
        fontSize: "14px",
        lineHeight: "16px",
    },
    yourAnswersMobileContainer: {
        minHeight: "100vh",
        marginBottom: 50,
    },
    menuButtonActive: {
        backgroundColor: KnowitColors.white + "!important",
        marginRight: -2,
    },
    MenuButton: {
        "&:hover": {
            backgroundColor: "disable",
        },
        overflow: "wrap",
        fontSize: 13,
        fontWeight: "bold",
        border: "none",
        justifyContent: "left",
        borderRadius: "0px 17px 17px 0px",
        width: "fit-content", // todo denne kan tilbakestilles?
        padding: "10px 30px",
    },
    formHeader: {
        display: "flex",
        padding: "5px 5px 10px 5px",
        justifyContent: "center",
    },
    categoryDescriptionForm: {
        margin: "5px 5px 5px 15px",
        fontSize: 14,
        fontStyle: "italic",
    },
});

export const YourAnswersMobile = ({ ...props }: YourAnswerProps) => {
    const style = yourAnswersStyleMobile();

    const getCategoryButtons = () => {
        let buttons: JSX.Element[] = [];

        const categories = props.categories.map((cat) => {
            return {
                text: cat,
                buttonType: MenuButton.Category,
                activePanel: Panel.MyAnswers,
            };
        });

        categories.forEach((category, index) => {
            buttons.push(
                <Button
                    key={category.text}
                    className={clsx(
                        style.MenuButton,
                        props.activeCategory === category.text
                            ? style.menuButtonActive
                            : "",
                        props.activePanel === category.activePanel
                            ? ""
                            : style.hidden
                    )}
                    onClick={() => {
                        props.checkIfCategoryIsSubmitted(
                            category.buttonType,
                            category.text
                        );
                    }}
                >
                    <div className={clsx(style.buttonText)}>
                        {index + 1}. {category.text}
                    </div>
                    {props.alerts?.categoryMap.has(category.text) ? (
                        <AlertNotification
                            type={AlertType.Multiple}
                            message="Ikke besvart eller utdaterte spørsmål i kategori"
                            size={props.alerts.categoryMap.get(category.text)}
                        />
                    ) : (
                        ""
                    )}
                </Button>
            );
        });
        return buttons;
    };

    const getCategoryButtonsCollapsed = () => {
        let buttons: JSX.Element[] = [];

        const categories = props.categories.map((cat) => {
            return {
                text: cat,
                buttonType: MenuButton.Category,
                activePanel: Panel.MyAnswers,
            };
        });

        categories.forEach((category, index) => {
            if (category.text === props.activeCategory) {
                buttons.push(
                    <Button
                        key={category.text}
                        className={clsx(
                            style.MenuButton,
                            props.activeCategory === category.text
                                ? style.menuButtonActive
                                : "",
                            props.activePanel === category.activePanel
                                ? ""
                                : style.hidden
                        )}
                        onClick={() => {
                            props.checkIfCategoryIsSubmitted(
                                category.buttonType,
                                category.text
                            );
                        }}
                    >
                        <div className={clsx(style.buttonText)}>
                            {index + 1}. {category.text}
                        </div>
                        {props.alerts?.categoryMap.has(category.text) ? (
                            <AlertNotification
                                type={AlertType.Multiple}
                                message="Ikke besvart eller utdaterte spørsmål i kategori"
                                size={props.alerts.categoryMap.get(
                                    category.text
                                )}
                            />
                        ) : (
                            ""
                        )}
                    </Button>
                );
            }
        });
        return buttons;
    };

    const getCategoryDescription = (): string => {
        let categoryDesc = props.formDefinition?.questions.items.find(
            (q) => q.category.text === props.activeCategory
        );
        return categoryDesc?.category.description ?? "";
    };

    const { setCollapseMobileCategories } = props;
    useEffect(() => {
        setCollapseMobileCategories(false);
    }, [setCollapseMobileCategories]);

    return (
        <div
            className={
                props.activePanel === Panel.MyAnswers
                    ? style.yourAnswersMobileContainer
                    : style.hidden
            }
        >
            <div
                className={style.navigationContainer}
                ref={props.categoryNavRef}
            >
                {/* <div className={props.commonCardProps.active ? style.categoryList : style.hidden}> */}
                <div
                    className={
                        props.activePanel === Panel.MyAnswers
                            ? style.categoryList
                            : style.hidden
                    }
                >
                    <div className={style.categoryListInner}>
                        {getCategoryButtons()}
                    </div>
                </div>
            </div>
            <div
                className={
                    props.collapseMobileCategories
                        ? style.navigationContainerScrolled
                        : style.hidden
                }
            >
                {/* <div className={style.navigationContainerScrolled} ref={props.categoryNavRef}> */}

                {/* <div className={props.commonCardProps.active ? style.categoryList : style.hidden}> */}
                <div
                    className={
                        props.activePanel === Panel.MyAnswers
                            ? style.categoryList
                            : style.hidden
                    }
                >
                    <div className={style.categoryListInner}>
                        {getCategoryButtonsCollapsed()}
                    </div>
                </div>
                <div className={clsx(props.answerEditMode ? "" : style.hidden)}>
                    <div className={style.formHeader}>
                        <ProgressBar
                            alerts={props.alerts}
                            totalQuestions={
                                props.formDefinition?.questions.items.length ??
                                0
                            }
                        />
                    </div>
                </div>
            </div>
            {/* <div className={props.commonCardProps.active ? style.answerBox : style.hidden}> */}
            <div
                className={
                    props.activePanel === Panel.MyAnswers
                        ? props.collapseMobileCategories
                            ? style.answerBoxScrolled
                            : style.answerBox
                        : style.hidden
                }
            >
                <div
                    className={clsx(
                        props.answerEditMode ? style.hidden : "",
                        style.answerView
                    )}
                >
                    <div className={style.catHeader}>
                        <BlockInfo
                            questions={props.questionAnswers.get(
                                props.activeCategory
                            )}
                        />
                        <Button
                            className={style.editButton}
                            onClick={() => props.enableAnswerEditMode()}
                        >
                            Endre svar
                        </Button>
                        {/* <div className={style.catText} >{props.activeCategory}</div> */}
                    </div>
                    <div className={style.graphHolder}>
                        <AnswerDiagram
                            questionAnswers={props.questionAnswers}
                            activeCategory={props.activeCategory}
                            isMobile={true}
                        />
                    </div>
                </div>
                <div
                    className={clsx(
                        props.answerEditMode ? "box" : style.hidden,
                        style.form
                    )}
                >
                    {/* <Button onClick={() => props.answerViewModeActive(true)}>TEMP</Button> */}
                    <div className={style.formHeader}>
                        <ProgressBar
                            alerts={props.alerts}
                            totalQuestions={
                                props.formDefinition?.questions.items.length ??
                                0
                            }
                        />
                    </div>
                    <div className={style.categoryDescriptionForm}>
                        {getCategoryDescription()}
                    </div>
                    <Form
                        {...props}
                        isMobile={true}
                        alerts={props.alerts}
                        scrollToTop={props.scrollToTop}
                    />
                </div>
            </div>
        </div>
    );
};
