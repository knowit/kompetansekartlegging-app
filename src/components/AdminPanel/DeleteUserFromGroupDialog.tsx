import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import ErrorIcon from "@material-ui/icons/Error";

import { dialogStyles } from "../../styles";
import { getAttribute } from "./helpers";

const DeleteUserFromGroupDialog = ({
    onCancel,
    onConfirm,
    onExited,
    user,
    open,
    roleName,
    disableRoleSuffix,
    children,
}: any) => {
    const style = dialogStyles();
    const name = getAttribute(user, "name");
    const role = disableRoleSuffix ? roleName : `${roleName}rollen`;

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
                <span
                    className={style.dialogTitleText}
                >{`Fjern ${name} fra ${role}?`}</span>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Er du sikker på at du har lyst å fjerne {name} fra {role}?{" "}
                    {children}
                </DialogContentText>
            </DialogContent>
            <DialogActions className={style.alertButtons}>
                <Button onClick={onConfirm} className={style.cancelButton}>
                    <span className={style.buttonText}>Fjern</span>
                </Button>
                <Button onClick={onCancel} className={style.confirmButton}>
                    <span className={style.buttonText}>Avbryt</span>
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteUserFromGroupDialog;
