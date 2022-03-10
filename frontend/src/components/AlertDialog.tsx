import React from "react";
import {
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from "@material-ui/core";
import { AlertDialogProps } from "../types";
import ErrorIcon from "@material-ui/icons/Error";
import { dialogStyles } from "../styles";

export const AlertDialog = ({ ...props }: AlertDialogProps) => {
    const style = dialogStyles();

    const handleStayInForm = () => {
        props.setAlertDialogOpen(false);
    };

    const handleLeave = () => {
        if (props.leaveFormButtonClicked) props.leaveFormButtonClicked();
    };

    return (
        <Dialog
            open={props.alertDialogOpen}
            onClose={handleStayInForm}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                style: { borderRadius: 30 },
            }}
        >
            <DialogTitle id="alert-dialog-title" className={style.dialogTitle}>
                <ErrorIcon
                    fontSize="large"
                    className={style.errorIcon}
                ></ErrorIcon>
                <div className={style.dialogTitleText}>
                    Obs! Svarene dine er ikke lagret.
                </div>
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="alert-dialog-description"
                    className={style.alertText}
                >
                    Hvis du forlater skjemaet nå vil ikke endringene du har
                    gjort bli lagret.
                </DialogContentText>
            </DialogContent>
            <DialogActions className={style.alertButtons}>
                <Button onClick={handleLeave} className={style.cancelButton}>
                    <div className={style.buttonText}>Forlat skjemaet</div>
                </Button>
                <Button
                    autoFocus
                    onClick={handleStayInForm}
                    className={style.confirmButton}
                >
                    <div className={style.buttonText}>Bli på skjemaet</div>
                </Button>
            </DialogActions>
        </Dialog>
    );
};
