import React, { useState } from "react";

import Button from "@material-ui/core/Button";

import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import { dialogStyles } from "../../../styles";
import { CloseIcon } from "../../DescriptionTable";

const AddCatalogDialog = ({ onCancel, onConfirm, open }: any) => {
    const style = dialogStyles();
    const [name, setName] = useState("");

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                style: { borderRadius: 30 },
            }}
        >
            <DialogTitle>
                <Box
                    component="div"
                    mb={1}
                    display="flex"
                    justifyContent="space-between"
                >
                    <span className={style.dialogTitleText}>
                        Lag ny katalog
                    </span>
                    <IconButton
                        className={style.closeButton}
                        onClick={onCancel}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <TextField
                    autoFocus
                    fullWidth
                    label="Navnet på den nye katalogen"
                    variant="outlined"
                    error={name === ""}
                    helperText={name === "" && "Navnet kan ikke være tomt."}
                    value={name}
                    className={style.textField}
                    onChange={(e: any) => setName(e.target.value)}
                />
            </DialogTitle>
            <DialogActions className={style.alertButtons}>
                <Button onClick={onCancel} className={style.cancelButton}>
                    <span className={style.buttonText}>Avbryt</span>
                </Button>
                <Button
                    disabled={name === ""}
                    onClick={() => onConfirm(name)}
                    className={style.confirmButton}
                >
                    <span className={style.buttonText}>Legg til</span>
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCatalogDialog;
