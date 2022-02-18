import { makeStyles } from "@material-ui/core";
import { KnowitColors } from "../styles";
import { QuestionAnswer } from "../types";
import React from "react";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@material-ui/icons/ErrorOutlineRounded";
import UpdateIcon from "@material-ui/icons/Update";
import { staleAnswersLimit } from "./AlertNotification";

const useStyles = makeStyles({
    root: {},
    blockOK: {
        display: "flex",
        justifyContent: "flex-end",
        fontWeight: "normal",
        alignItems: "center",
        padding: 5,
        color: KnowitColors.darkBrown,
    },
    blockAlert: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 5,
        fontWeight: "bold",
        color: KnowitColors.fuchsia,
    },
    warningText: {
        fontFamily: "Arial",
        fontSize: "14px",
        marginLeft: 10,
        color: KnowitColors.darkBrown,
    },
});

export enum AlertType {
    Incomplete,
    Outdated,
    Multiple,
}

export const BlockInfo = (props: {
    questions: QuestionAnswer[] | undefined;
}) => {
    const classes = useStyles();

    enum TimeType {
        MINUTES, // For testing
        DAYS,
    }

    const timeBetweenString = (
        then: number,
        now: number,
        type: TimeType
    ): string => {
        switch (type) {
            case TimeType.MINUTES:
                return Math.round((now - then) / (1000 * 60)) + " minutter";
            case TimeType.DAYS:
                return (
                    Math.round((now - then) / (1000 * 60 * 60 * 24)) + " dager"
                );
        }
    };

    let questions = props.questions ?? [];

    let answeredQuestions = questions.filter(
        (question) => question.motivation !== -1 && question.knowledge !== -1
    );

    if (questions.length > answeredQuestions.length)
        return (
            <div className={classes.root}>
                <div className={classes.blockAlert}>
                    <ErrorOutlineRoundedIcon />
                    <div
                        className={classes.warningText}
                    >{`Blokken er ikke ferdig utfylt!`}</div>
                </div>
            </div>
        );

    let now = Date.now();
    var timeOfOldestQuestion = now;
    answeredQuestions?.forEach((question) => {
        if (question.updatedAt < timeOfOldestQuestion)
            timeOfOldestQuestion = question.updatedAt;
    });
    let timeDiff = now - timeOfOldestQuestion;
    if (timeDiff > staleAnswersLimit) {
        return (
            <div className={classes.root}>
                <div className={classes.blockAlert}>
                    <UpdateIcon />
                    <div
                        className={classes.warningText}
                    >{`Det har gått ${timeBetweenString(
                        timeOfOldestQuestion,
                        now,
                        TimeType.DAYS
                    )} siden blokken ble oppdatert!`}</div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={classes.root}>
                <div className={classes.blockOK}>
                    <CheckCircleOutlineRoundedIcon />
                    <div
                        className={classes.warningText}
                    >{`Blokken ble sist oppdatert ${new Date(
                        timeOfOldestQuestion
                    ).toLocaleDateString("no-NO")}`}</div>
                </div>
            </div>
        );
    }
};
