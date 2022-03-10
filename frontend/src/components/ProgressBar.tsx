import React, { useEffect, useState } from "react";
import { ProgressProps } from "../types";
import { createStyles, makeStyles, withStyles } from "@material-ui/core";
import { KnowitColors } from "../styles";
import LinearProgress, {
    LinearProgressProps,
} from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "75%",
        maxWidth: 1000,
        backgroundColor: "white",
        zIndex: 1,
    },
    percentage: {
        fontFamily: "Arial",
        fontSize: "12px",
        fontWeight: "bold",
        width: "fit-content",
        paddingRight: "1vw",
    },
    bar: {
        flexGrow: 1,
    },
});

const ThemedLinearProgress = withStyles(() =>
    createStyles({
        root: {
            height: 6,
            borderRadius: 3,
        },
        colorPrimary: {
            backgroundColor: KnowitColors.beige,
        },
        bar: {
            borderRadius: 3,
            backgroundColor: KnowitColors.darkBrown,
        },
    })
)(LinearProgress);

export default function ProgressBar({ ...props }: ProgressProps) {
    const classes = useStyles();

    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        const updateProgress = () => {
            let unfilledQuestions = props.alerts?.qidMap.size ?? 0;
            let filledQuestions = props.totalQuestions - unfilledQuestions;
            let progressPercentage =
                (filledQuestions / props.totalQuestions) * 100;
            setProgress(progressPercentage);
        };
        updateProgress();
    }, [props.alerts, props.totalQuestions]);

    const LinearProgressWithPercentage = (
        props: LinearProgressProps & { value: number }
    ) => {
        return (
            <div className={classes.root}>
                <div className={classes.percentage}>
                    {`${Math.round(progress)}%`}
                </div>
                <div className={classes.bar}>
                    <ThemedLinearProgress variant="determinate" {...props} />
                </div>
            </div>
        );
    };

    return <LinearProgressWithPercentage value={progress} />;
}
