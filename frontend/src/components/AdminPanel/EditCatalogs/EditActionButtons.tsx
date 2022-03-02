import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { KnowitColors } from "../../../styles";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: "8px",
            display: "flex",
            justifyContent: "center",
            width: "100%",
        },
        confirmButton: {
            width: "162px",
            height: "38px",
            border: "3px solid",
            backgroundColor: KnowitColors.lightGreen,
            borderRadius: "19px",
            borderColor: KnowitColors.lightGreen,
            marginLeft: "32px",
            transition: "250ms",
            "&:hover": {
                color: KnowitColors.lightGreen,
            },
        },
        cancelButton: {
            width: "162px",
            height: "38px",
            border: "3px solid",
            borderColor: KnowitColors.flamingo,
            boxsizing: "border-box",
            borderRadius: "19px",
            transition: "250ms",
            color: KnowitColors.flamingo,
            "&:hover": {
                color: KnowitColors.black,
                backgroundColor: KnowitColors.flamingo,
            },
        },
        buttonText: {
            fontWeight: "bold",
            textTransform: "none",
            lineHeight: 1,
        },
    })
);

const EditActionButtons = ({ onSave, onCancel, disabled }: any) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Button onClick={onCancel} className={classes.cancelButton}>
                <span className={classes.buttonText}>Avbryt</span>
            </Button>
            <Button
                disabled={disabled}
                onClick={onSave}
                className={classes.confirmButton}
            >
                <span className={classes.buttonText}>Lagre</span>
            </Button>
        </div>
    );
};

export default EditActionButtons;
