import { Button, makeStyles } from "@material-ui/core";
import React, { Fragment, useRef } from "react";
import { KnowitColors } from "../styles";
import { FormProps, SliderValues } from "../types";
import { QuestionType as QuestionTypeT } from "../API";
import Question from "./Question";
import ArrowForwardRoundedIcon from "@material-ui/icons/ArrowForwardRounded";

const FormStyleDesktop = makeStyles({
    root: {
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        backgroundColor: KnowitColors.white,
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 10,
    },
    blockButtons: {
        width: "90%",
        maxWidth: 1200,
        display: "flex",
        justifyContent: "space-around",
        margin: "30px 0px 50px",
    },
    submitButton: {
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 18,
        fontWeight: "bold",
        textTransform: "none",
        color: KnowitColors.black,
        backgroundColor: KnowitColors.white,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: KnowitColors.lightGreen,
        "&:hover": {
            background: KnowitColors.ecaluptus,
        },
    },
    submitAndProceedButton: {
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 18,
        fontWeight: "bold",
        textTransform: "none",
        color: KnowitColors.black,
        backgroundColor: KnowitColors.lightGreen,
        "&:hover": {
            background: KnowitColors.ecaluptus,
        },
    },
    buttonIcon: {
        paddingLeft: 10,
    },
});

const FormStyleMobile = makeStyles({
    root: {
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        backgroundColor: KnowitColors.white,
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 10,
    },
    blockButtons: {
        padding: 10,
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        // marginBottom: 50
    },
    submitButton: {
        margin: 10,
        width: "80%",
        borderRadius: 18,
        fontWeight: "bold",
        textTransform: "none",
        color: KnowitColors.black,
        backgroundColor: KnowitColors.white,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: KnowitColors.lightGreen,
        "&:hover": {
            background: KnowitColors.ecaluptus,
        },
    },
    submitAndProceedButton: {
        margin: 10,
        width: "80%",
        borderRadius: 18,
        fontWeight: "bold",
        textTransform: "none",
        color: KnowitColors.black,
        backgroundColor: KnowitColors.lightGreen,
        "&:hover": {
            background: KnowitColors.ecaluptus,
        },
    },
    buttonIcon: {
        paddingLeft: 10,
    },
});

type QuestionType = {
    id: string;
    text: string;
    topic: string;
    category: {
        text: string;
    };
};

export const Form = ({ ...props }: FormProps) => {
    const sliderValues = useRef<Map<string, SliderValues>>(new Map()); //String is questionid, values are knowledge and motivation

    const style = props.isMobile ? FormStyleMobile() : FormStyleDesktop();

    const setSliderValues = (questionId: string, values: SliderValues) => {
        sliderValues.current.set(questionId, values);
        props.updateAnswer(props.activeCategory, sliderValues.current);
    };

    const getQuestionsForCategory = (
        _items: QuestionType[] | undefined
    ): JSX.Element[] => {
        //console.log("Props to make questions from: ", props.questionAnswers);
        let questionAnswers =
            props.questionAnswers
                ?.get(props.activeCategory)
                ?.map((questionAnswer) => {
                    const question = questionAnswer.question;
                    // great stuff guys; don't ever see this getting back at us
                    if (question.type === QuestionTypeT.customScaleLabels) {
                        sliderValues.current.set(question.id, {
                            customScaleValue: questionAnswer.customScaleValue,
                        });
                    } else {
                        sliderValues.current.set(question.id, {
                            knowledge: questionAnswer.knowledge,
                            motivation: questionAnswer.motivation,
                        });
                    }
                    return (
                        <Question
                            key={question.id}
                            questionAnswer={questionAnswer}
                            updateAnswer={props.updateAnswer}
                            knowledgeDefaultValue={questionAnswer.knowledge}
                            motivationDefaultValue={questionAnswer.motivation}
                            setIsCategorySubmitted={
                                props.setIsCategorySubmitted
                            }
                            isMobile={props.isMobile}
                            alerts={props.alerts}
                            sliderValues={sliderValues.current}
                            setSliderValues={setSliderValues}
                        />
                    );
                }) || [];
        //console.log("Form question answers:", questionAnswers);
        return questionAnswers;
    };

    const handleClickSubmit = async () => {
        props.updateAnswer(props.activeCategory, sliderValues.current);
        props.createUserForm();
        props.scrollToTop();
    };

    const handleClickProceed = async () => {
        props.updateAnswer(props.activeCategory, sliderValues.current);
        props.submitAndProceed();
        props.scrollToTop();
    };

    const createQuestionCategory = (): JSX.Element => {
        if (!props.formDefinition) return <Fragment />;
        return (
            <Fragment>
                {getQuestionsForCategory(undefined)}
                <div className={style.blockButtons}>
                    {props.categories.length > 0 ? (
                        <Button
                            onClick={handleClickSubmit}
                            className={style.submitButton}
                        >
                            Send inn svar og avslutt
                        </Button>
                    ) : (
                        ""
                    )}
                    {props.categories.findIndex(
                        (cat) => cat === props.activeCategory
                    ) !==
                    props.categories.length - 1 ? (
                        <Button
                            onClick={handleClickProceed}
                            className={style.submitAndProceedButton}
                        >
                            Lagre og gå videre
                            <ArrowForwardRoundedIcon
                                className={style.buttonIcon}
                            />
                        </Button>
                    ) : (
                        ""
                    )}
                </div>
            </Fragment>
        );
    };

    return <div className={style.root}>{createQuestionCategory()}</div>;
};
