import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { KnowitColors } from "../styles";
import { YourAnswerProps, Panel } from "../types";
import AnswerDiagram from "./AnswerDiagram";
import { Form } from "./Form";
import ProgressBar from "./ProgressBar";
import { BlockInfo } from "./BlockInfo";

const cardCornerRadius: number = 40;
const zIndex: number = 20;

const yourAnwersStyle = makeStyles({
    hidden: {
        display: "none",
    },
    answerBox: {
        width: "100%",
        height: "100%",
    },
    answerView: {
        marginRight: 10,
        width: "100%",
        height: "100%",
        borderRadius: 10,
        background: KnowitColors.white,
        overflowY: "auto",
    },
    form: {
        width: "100%",
        height: "calc(100% - 62px - 40px)", // 100% - height of form header - 40px padding
        overflowY: "auto",
    },
    progressForm: {
        height: "100%",
    },
    leftCard: {
        width: "20%",
    },
    categoryListInner: {
        marginLeft: 10,
        textAlign: "center",
    },
    cardHeaderOpen: {
        display: "flex",
        paddingTop: cardCornerRadius,
        height: "max-content",
        backgroundColor: KnowitColors.greyGreen,
    },
    cardHeaderClosed: {
        display: "flex",
        height: "max-content",
        paddingTop: cardCornerRadius,
        marginTop: -cardCornerRadius,
        boxShadow: "0px 3px 2px gray",
        borderRadius: "0px 0px 20px 20px",
        backgroundColor: KnowitColors.greyGreen,
    },
    catHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "10%",
        width: "95%",
        maxWidth: 1100,
        margin: "10px",
        maxHeight: "50px",
    },
    infoButtonGroup: {
        width: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    blockInfo: {
        width: "fit-content",
        fontSize: "22px",
        fontWeight: "bold",
        marginLeft: 20,
    },
    graphHolder: {
        width: "90%",
        height: "70%",
        marginLeft: 50,
    },
    editButton: {
        fontWeight: "bold",
        margin: 5,
        padding: 10,
        width: 106,
        borderRadius: 19,
        color: KnowitColors.black,
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
        fontFamily: "Arial",
        fontSize: 16,
        color: KnowitColors.darkBrown,
    },
    buttonText: {
        textTransform: "none",
        textAlign: "left",
        justifyContent: "left",
    },
    cardButton: {
        fontWeight: "bold",
        fontSize: 18,
        padding: 10,
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        textAlign: "left",
        paddingLeft: 50,
        width: "100%",
    },
    bottomCardClosed: {
        zIndex: zIndex,
    },
    bottomCardOpen: {
        display: "flex",
        flexDirection: "row",
        // overflowY: 'scroll',
        height: "100%",
    },
    formHeader: {
        marginTop: "30px",
        marginLeft: "40px",
        backgroundColor: "white",
    },
    categoryTitle: {
        fontSize: 22,
        fontWeight: "bold",
    },
    categoryDescription: {
        margin: "30px 0px 30px 30px",
        maxWidth: "60%",
        minWidth: 800,
        fontStyle: "italic",
    },
    categoryDescriptionForm: {
        margin: "0px 0px 10px 40px",
        maxWidth: "60%",
        minWidth: 800,
        fontStyle: "italic",
    },
});

export const YourAnswersDesktop = ({ ...props }: YourAnswerProps) => {
    const style = yourAnwersStyle();

    const scrollRef = React.useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        scrollRef.current?.scroll(0, 0);
    };

    const getCategoryDescription = (): string => {
        let categoryDesc = props.formDefinition?.questions.items.find(
            (q) => q.category.text === props.activeCategory
        );
        return categoryDesc?.category.description ?? "";
    };

    return (
        <div
            className={clsx(
                props.activePanel === Panel.MyAnswers
                    ? style.bottomCardOpen
                    : style.bottomCardClosed
            )}
        >
            <div
                className={
                    props.activePanel === Panel.MyAnswers
                        ? style.answerBox
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
                        <div className={style.blockInfo}>
                            {props.activeCategory}
                        </div>
                        <div className={style.infoButtonGroup}>
                            <BlockInfo
                                questions={props.questionAnswers.get(
                                    props.activeCategory
                                )}
                            />
                            <Button
                                className={style.editButton}
                                onClick={() => props.enableAnswerEditMode()}
                            >
                                Fyll ut
                            </Button>
                        </div>
                    </div>
                    <div className={style.categoryDescription}>
                        {getCategoryDescription()}
                    </div>

                    <div className={style.graphHolder}>
                        <AnswerDiagram
                            questionAnswers={props.questionAnswers}
                            activeCategory={props.activeCategory}
                            isMobile={false}
                        />
                    </div>
                </div>
                <div
                    className={clsx(
                        props.answerEditMode ? "" : style.hidden,
                        style.progressForm
                    )}
                >
                    <div className={style.formHeader}>
                        <ProgressBar
                            alerts={props.alerts}
                            totalQuestions={
                                props.formDefinition?.questions.items.length ??
                                0
                            }
                        />
                        <h2 className={style.categoryTitle}>
                            {props.activeCategory}
                        </h2>
                    </div>

                    <div
                        className={clsx(
                            props.answerEditMode ? "" : style.hidden,
                            style.form
                        )}
                        ref={scrollRef}
                    >
                        <div className={style.categoryDescriptionForm}>
                            {getCategoryDescription()}
                        </div>

                        <Form
                            {...props}
                            scrollToTop={scrollToTop}
                            isMobile={false}
                            alerts={props.alerts}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
