import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import ErrorIcon from "@material-ui/icons/Error";

import { dialogStyles } from "../../styles";

const DeleteGroupDialog = ({
    onCancel,
    onConfirm,
    group,
    groupLeaders,
    open,
}: any) => {
    const style = dialogStyles();

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            PaperProps={{
                style: { borderRadius: 30 },
            }}
        >
            <DialogTitle className={style.dialogTitle}>
                <ErrorIcon
                    fontSize="large"
                    className={style.errorIcon}
                ></ErrorIcon>
                <span className={style.dialogTitleText}>{`Fjern gruppe?`}</span>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Er du sikker på at du har lyst å fjerne gruppen?
                </DialogContentText>
            </DialogContent>
            <DialogActions className={style.alertButtons}>
                <Button onClick={onConfirm} className={style.cancelButton}>
                    Fjern
                </Button>
                <Button onClick={onCancel} className={style.confirmButton}>
                    Avbryt
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteGroupDialog;
