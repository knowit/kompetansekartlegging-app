import React, { useState } from "react";

import { makeStyles, createStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import { KnowitColors } from "../../../styles";
import QuestionListItemEdit from "./QuestionListItemEdit";

const useQuestionListStyles = makeStyles(() =>
    createStyles({
        listItem: {
            transition: "150ms",
            backgroundColor: KnowitColors.beige,
            padding: "16px",
            paddingTop: "0",
            marginTop: "0",
            borderRadius: "16px",
            marginBottom: "10px",
            "&:hover": {
                background: KnowitColors.greyGreen,
            },
        },
        listItemText: {
            color: KnowitColors.darkBrown,
            "& span": {
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            },
        },
        button: {
            color: KnowitColors.darkBrown,
            marginLeft: "16px",
            "& span": {
                justifyContent: "center",
            },
        },
        actions: {
            display: "flex",
            alignItems: "center",
        },
    })
);

const QuestionListItem = ({
    question: q,
    index: ind,
    moveQuestion,
    saveQuestion,
    deleteQuestion,
    enableUpdates,
    questions,
    categories,
}: any) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const classes = useQuestionListStyles();

    return editMode ? (
        <QuestionListItemEdit
            question={q}
            saveQuestion={saveQuestion}
            categories={categories}
            setEditMode={setEditMode}
        />
    ) : (
        <ListItem key={q.id} className={classes.listItem}>
            <ListItemText
                primary={
                    <>
                        {ind + 1}. {q.topic}
                        <div className={classes.actions}>
                            <IconButton
                                onClick={() => setEditMode(true)}
                                className={classes.button}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => deleteQuestion(q)}
                                className={classes.button}
                            >
                                <DeleteIcon />
                            </IconButton>
                            <ButtonGroup
                                disableElevation
                                variant="text"
                                size="small"
                                orientation="vertical"
                            >
                                <Button
                                    size="small"
                                    onClick={() => moveQuestion(q, 1)}
                                    className={classes.button}
                                    disabled={!enableUpdates || ind === 0}
                                >
                                    <KeyboardArrowUpIcon fontSize="small" />
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => moveQuestion(q, -1)}
                                    className={classes.button}
                                    disabled={
                                        !enableUpdates ||
                                        ind === questions.length - 1
                                    }
                                >
                                    <KeyboardArrowDownIcon fontSize="small" />
                                </Button>
                            </ButtonGroup>
                        </div>
                    </>
                }
                secondary={q.text}
                className={classes.listItemText}
            />
        </ListItem>
    );
};

export default QuestionListItem;
