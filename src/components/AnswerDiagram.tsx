import { makeStyles } from "@material-ui/core";
import React from "react";
import { QuestionType } from "../API";
import {
    AnswerDiagramProps,
    CustomScaleLabelsChartData,
    ChartData,
    QuestionAnswer,
} from "../types";
import { CustomScaleChart } from "./CustomScaleChart";
import { CombinedChart } from "./CombinedChart";
import { CombinedChartMobile } from "./CombinedChartMobile";

const answerDiagramStyle = makeStyles({
    answerDiagramContainer: {
        paddingBottom: 50,
    },
});

interface Scores {
    valueKnowledge: number[];
    valueMotivation: number[];
}

const scores = (
    quAns: QuestionAnswer,
    knowledgeStart: number,
    motivationStart: number
): Scores => {
    return {
        valueKnowledge: [
            knowledgeStart,
            knowledgeStart + (quAns.knowledge === -1 ? 0 : quAns.knowledge),
        ],
        valueMotivation: [
            motivationStart,
            motivationStart + (quAns.motivation === -1 ? 0 : quAns.motivation),
        ],
    };
};

interface CustomScaleLabelsScores {
    value: number;
}

const scoresCustomScaleLabels = (
    quAns: QuestionAnswer
): CustomScaleLabelsScores => {
    return {
        value: quAns.customScaleValue === -1 ? 0 : quAns.customScaleValue,
    };
};

export default function AnswerDiagram({ ...props }: AnswerDiagramProps) {
    const styles = answerDiagramStyle();

    const activeCategory = props.activeCategory;
    const questionAnswers = props.questionAnswers.get(activeCategory);
    const knowledgeMotivationQuAns = questionAnswers?.filter(
        (quAns) =>
            quAns.question.type === null ||
            quAns.question.type === QuestionType.knowledgeMotivation
    );
    const customScaleLabelsQuAns = questionAnswers?.filter(
        (quAns) => quAns.question.type === QuestionType.customScaleLabels
    );

    const knowledgeStart = props.isMobile ? 7 : 0;
    const motivationStart = props.isMobile ? 0 : 7;
    const knowledgeMotivationChartData: ChartData[] =
        knowledgeMotivationQuAns?.map((quAns) => {
            return {
                name: quAns.question.topic,
                ...scores(quAns, knowledgeStart, motivationStart),
            };
        }) || [];

    const customScaleLabelsChartData: CustomScaleLabelsChartData[] =
        customScaleLabelsQuAns?.map((quAns) => {
            return {
                startLabel: quAns.question.scaleStart,
                middleLabel: quAns.question.scaleMiddle,
                endLabel: quAns.question.scaleEnd,
                name: quAns.question.topic,
                ...scoresCustomScaleLabels(quAns),
            };
        }) || [];

    return props.isMobile ? (
        <CombinedChartMobile chartData={knowledgeMotivationChartData} />
    ) : (
        <div className={styles.answerDiagramContainer}>
            <CombinedChart chartData={knowledgeMotivationChartData} />
            <CustomScaleChart chartData={customScaleLabelsChartData} />
        </div>
    );
}
