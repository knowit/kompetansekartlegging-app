import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TreeView from "@material-ui/lab/TreeView";
import {
    AnswerHistoryProps,
    HistoryTreeViewProps,
    UserAnswer,
    UserFormWithAnswers,
} from "../types";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { makeStyles } from "@material-ui/core/styles";

const answerHistoryStyles = makeStyles({
    historyView: {
        height: "100%",
        widht: "100%",
    },
    content: {
        maxHeight: "70vh",
    },
});

function* generator() {
    let i = 0;
    while (true) {
        yield i++;
    }
}

const formatDate = (dateString: string) => {
    let temp: string[] = dateString.split("T");
    return temp[0] + "  " + temp[1].slice(0, 5);
};

const parseScore = (score: number) => {
    return score < 0 ? "Ikke svart" : score;
};

export const AnswerHistory = ({ ...props }: AnswerHistoryProps) => {
    const style = answerHistoryStyles();

    const handleClose = () => {
        props.setHistoryViewOpen(false);
    };

    const HistoryTreeView = ({ ...props }: HistoryTreeViewProps) => {
        const g = generator();

        const renderEntry = (entry: UserFormWithAnswers) => {
            let key = String(g.next().value);
            return (
                <TreeItem
                    key={key}
                    nodeId={key}
                    label={formatDate(entry.createdAt)}
                >
                    {entry.questionAnswers.items.map((answer) =>
                        renderAnswer(answer)
                    )}
                </TreeItem>
            );
        };

        const renderAnswer = (answer: UserAnswer) => {
            let key = String(g.next().value);
            return (
                <TreeItem
                    key={key}
                    nodeId={key}
                    label={findQuestion(answer.question.id)}
                >
                    <TreeItem
                        nodeId={String(g.next().value)}
                        label={"Kunnskap: " + parseScore(answer.knowledge)}
                    />
                    <TreeItem
                        nodeId={String(g.next().value)}
                        label={"Motivasjon: " + parseScore(answer.motivation)}
                    />
                </TreeItem>
            );
        };

        let sortedData = props.data.sort(
            (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );

        return (
            <TreeView
                className={style.historyView}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={["root"]}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                {sortedData.map((entry) => renderEntry(entry))}
            </TreeView>
        );
    };

    const findQuestion = (questionId: string): string => {
        let question = props.formDefinition?.questions.items.find(
            (q) => q.id === questionId
        );
        return question
            ? question?.category.text + ": " + question?.topic
            : "Not defined";
    };

    return (
        <div>
            <Dialog
                open={props.historyViewOpen}
                onClose={handleClose}
                scroll={"body"}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                    Svarhistorikk
                </DialogTitle>
                <DialogContent dividers={true} className={style.content}>
                    <HistoryTreeView data={props.history} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
