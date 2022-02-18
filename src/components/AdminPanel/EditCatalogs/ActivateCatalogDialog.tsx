import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import ErrorIcon from "@material-ui/icons/Error";

import { dialogStyles } from "../../../styles";

const ActivateCatalogDialog = ({
    onCancel,
    onConfirm,
    onExited,
    open,
}: any) => {
    const style = dialogStyles();

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            onExited={onExited}
            PaperProps={{
                style: { borderRadius: 30 },
            }}
        >
            <DialogTitle className={style.dialogTitle}>
                <ErrorIcon
                    fontSize="large"
                    className={style.errorIcon}
                ></ErrorIcon>
                <span className={style.dialogTitleText}>Bruk katalog?</span>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Er du sikker på at du har lyst å bruke denne katalogen?
                    Dette vil endre spørsmålsettet de ansatte svarer på.
                </DialogContentText>
            </DialogContent>
            <DialogActions className={style.alertButtons}>
                <Button onClick={onConfirm} className={style.cancelButton}>
                    <span className={style.buttonText}>Bruk</span>
                </Button>
                <Button onClick={onCancel} className={style.confirmButton}>
                    <span className={style.buttonText}>Avbryt</span>
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ActivateCatalogDialog;
