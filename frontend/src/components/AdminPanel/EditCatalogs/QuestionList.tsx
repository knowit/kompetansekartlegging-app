import React, { useState } from "react";

import List from "@material-ui/core/List";

import {
    updateQuestionIndex,
    updateQuestionTextTopicAndCategory,
    deleteQuestion as deleteQuestionApi,
} from "../catalogApi";
import { Question } from "../../../API";
import QuestionListItem from "./QuestionListItem";
import DeleteQuestionDialog from "./DeleteQuestionDialog";

const QuestionList = ({
    id,
    categories,
    questions,
    formDefinitionID,
    formDefinitionLabel,
    refreshQuestions,
}: any) => {
    const [enableUpdates, setEnableUpdates] = useState<boolean>(true);

    const [
        showDeleteQuestionDialog,
        setShowDeleteQuestionDialog,
    ] = useState<boolean>(false);
    const [questionToDelete, setQuestionToDelete] = useState<any>();
    const deleteQuestion = (question: any) => {
        setShowDeleteQuestionDialog(true);
        setQuestionToDelete(question);
    };
    const deleteQuestionConfirm = async () => {
        await deleteQuestionApi(questionToDelete.id);
        setShowDeleteQuestionDialog(false);
        refreshQuestions();
    };

    const moveQuestion = async (question: any, direction: number) => {
        setEnableUpdates(false);

        const me = question;
        const swapWith = questions.find(
            (c: any) => c.index === me.index - direction
        );
        await updateQuestionIndex(me, swapWith.index);
        await updateQuestionIndex(swapWith, me.index);

        setEnableUpdates(true);
        refreshQuestions();
    };

    const saveQuestion = async (
        question: any,
        topic: string,
        text: string,
        categoryID: string,
        questionConfig: any
    ) => {
        await updateQuestionTextTopicAndCategory(
            question,
            topic,
            text,
            categoryID,
            questionConfig
        );
        refreshQuestions();
    };

    return (
        <>
            {questions.length === 0 && (
                <p>Ingen spørsmål i denne kategorien ennå.</p>
            )}
            <List>
                {questions.map((q: Question, ind: number) => (
                    <QuestionListItem
                        key={q.id}
                        question={q}
                        index={ind}
                        moveQuestion={moveQuestion}
                        saveQuestion={saveQuestion}
                        deleteQuestion={deleteQuestion}
                        enableUpdates={enableUpdates}
                        questions={questions}
                        categories={categories}
                    />
                ))}
            </List>
            {questionToDelete && (
                <DeleteQuestionDialog
                    open={showDeleteQuestionDialog}
                    onCancel={() => setShowDeleteQuestionDialog(false)}
                    onExited={() => setQuestionToDelete(null)}
                    onConfirm={deleteQuestionConfirm}
                    question={questionToDelete}
                />
            )}
        </>
    );
};

export default QuestionList;
