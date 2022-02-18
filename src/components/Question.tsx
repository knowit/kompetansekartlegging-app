import React from "react";
import clsx from "clsx";
import { QuestionType } from "../API";
import { QuestionProps, SliderKnowledgeMotivationValues } from "../types";
import Slider from "./Slider";
import { makeStyles } from "@material-ui/core";
import { KnowitColors } from "../styles";
import * as Icon from "../icons/iconController";
import { AlertNotification } from "./AlertNotification";

const questionStyleDesktop = makeStyles({
    root: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 20,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 5,
        backgroundColor: KnowitColors.white,
        borderRadius: 10,
        width: "90%",
        maxWidth: 1200,
    },
    topic: {
        display: "flex",
        alignItems: "center",
        fontSize: 15,
        fontWeight: "bold",
    },
    topicText: {},
    text: {
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 10,
    },
    answerArea: {
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "center",
        alignItems: "center",
    },
    sliderArea: {
        marginLeft: 30,
        marginRight: 20,
        padding: 20,
        width: "75%",
    },
    slider: {
        marginRight: 15,
        marginLeft: 15,
    },
    iconArea: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 30,
        paddingBottom: 10,
    },
    icon: {
        height: "100%",
        fill: KnowitColors.darkBrown,
    },
    smallBold: {
        fontSize: 14,
        fontWeight: "bold",
    },
    largeBold: {
        fontSize: 15,
        fontWeight: "bold",
    },
});

const questionStyleMobile = makeStyles({
    root: {
        margin: 5,
        paddingTop: 5,
        paddingBottom: 20,
        backgroundColor: KnowitColors.white,
        borderRadius: 10,
        width: "100%",
    },
    topic: {
        fontSize: 15,
        fontWeight: "bold",
        display: "flex",
    },
    topicText: {
        maxWidth: "80%",
    },
    text: {
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 10,
    },
    answerArea: {
        // display: 'flex',
        // flexWrap: "nowrap",
        justifyContent: "center",
        alignItems: "center",
    },
    sliderArea: {
        marginTop: 20,
        // marginLeft: 30,
        // marginRight: 20,
        // padding: 20,
        width: "100%",
    },
    slider: {
        marginRight: 15,
        marginLeft: 15,
    },
    iconArea: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 30,
    },
    icon: {
        height: "100%",
        fill: KnowitColors.darkBrown,
    },
    smallBold: {
        fontSize: 14,
        fontWeight: "bold",
    },
    largeBold: {
        fontSize: 15,
        fontWeight: "bold",
    },
});

const Question = ({ ...props }: QuestionProps) => {
    const question = props.questionAnswer.question;
    const questionId = question.id;
    const questionType = question.type || QuestionType.knowledgeMotivation;
    const questionTopic = question.topic;
    const questionText = question.text;
    const sliderValues = props.sliderValues.get(questionId);

    const style = props.isMobile
        ? questionStyleMobile()
        : questionStyleDesktop();

    const sliderChanged = (newValue: number, motivation: boolean) => {
        props.setIsCategorySubmitted(false);
        if (sliderValues) {
            if (questionType === QuestionType.knowledgeMotivation) {
                const sv = sliderValues as SliderKnowledgeMotivationValues;
                if (motivation) {
                    props.setSliderValues(questionId, {
                        knowledge: sv.knowledge || 0,
                        motivation: newValue,
                    });
                } else {
                    props.setSliderValues(questionId, {
                        knowledge: newValue,
                        motivation: sv.motivation || 0,
                    });
                }
            } else if (questionType === QuestionType.customScaleLabels) {
                props.setSliderValues(questionId, {
                    customScaleValue: newValue,
                });
            }
        }
    };

    return (
        <div className={style.root}>
            <div className={style.topic}>
                <div className={style.topicText}>{questionTopic}</div>
                {props.alerts?.qidMap.has(questionId) && (
                    <AlertNotification
                        type={props.alerts?.qidMap.get(questionId)!.type}
                        message={props.alerts?.qidMap.get(questionId)!.message}
                    />
                )}
            </div>
            {questionType === QuestionType.knowledgeMotivation && (
                <KnowledgeMotivationSliders
                    style={style}
                    sliderValues={sliderValues}
                    sliderChanged={sliderChanged}
                    isMobile={props.isMobile}
                />
            )}
            {questionType === QuestionType.customScaleLabels && (
                <CustomLabelSlider
                    question={question}
                    style={style}
                    sliderValues={sliderValues}
                    sliderChanged={sliderChanged}
                    isMobile={props.isMobile}
                />
            )}
            <div className={style.text}>{questionText}</div>
        </div>
    );
};

const KnowledgeMotivationSliders = ({
    style,
    sliderValues,
    sliderChanged,
    isMobile,
}: any) => {
    return (
        <div>
            <div className={style.answerArea}>
                <div className={clsx(style.largeBold)}>KOMPETANSE</div>
                <div className={style.sliderArea}>
                    <div className={style.iconArea}>
                        {Icon.GetIcons(true, style.icon)}
                    </div>
                    <div className={style.slider}>
                        <Slider
                            value={sliderValues?.knowledge || -2}
                            motivation={false}
                            sliderChanged={sliderChanged}
                            isMobile={isMobile}
                        />
                    </div>
                </div>
            </div>
            <div className={style.answerArea}>
                <div className={clsx(style.largeBold)}>MOTIVASJON</div>
                <div className={style.sliderArea}>
                    <div className={style.iconArea}>
                        {Icon.GetIcons(false, style.icon)}
                    </div>
                    <div className={style.slider}>
                        <Slider
                            value={sliderValues?.motivation || -2}
                            motivation={true}
                            sliderChanged={sliderChanged}
                            isMobile={isMobile}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const CustomLabelSlider = ({
    style,
    sliderValues,
    sliderChanged,
    question,
    isMobile,
}: any) => {
    const labels = [
        question.scaleStart,
        question.scaleEnd,
    ].filter((l) => !!l);
    return (
        <div>
            <div className={style.answerArea}>
                <div className={clsx(style.largeBold)}>SVAR</div>
                <div className={style.sliderArea}>
                    <div className={style.iconArea}>
                        {labels?.map((l: string) => (
                            <span key={l}>{l}</span>
                        ))}
                    </div>
                    <div className={style.slider}>
                        <Slider
                            value={sliderValues.customScaleValue || -2}
                            motivation={false}
                            sliderChanged={sliderChanged}
                            isMobile={isMobile}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Question;
