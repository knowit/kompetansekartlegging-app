import React, { useState } from "react";

import { makeStyles, createStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import TextField from "@material-ui/core/TextField";

import { KnowitColors } from "../../../styles";
import EditActionButtons from "./EditActionButtons";

const useCategoryListItemStyles = makeStyles(() =>
    createStyles({
        button: {
            color: KnowitColors.darkBrown,
            marginLeft: "16px",
        },
        // orderButton: {
        //     marginLeft: "16px",
        //     color: "white",
        // },
        listItem: {
            transition: "150ms",
            cursor: "pointer",
            backgroundColor: KnowitColors.beige,
            padding: "16px",
            borderRadius: "16px",
            marginBottom: "10px",
            "&:hover": {
                background: KnowitColors.greyGreen,
            },
        },
        listItemEdit: {
            backgroundColor: KnowitColors.darkBrown,
            color: "white",
            padding: "16px",
            borderRadius: "16px",
            marginBottom: "10px",
            flexWrap: "wrap",
        },
        listItemText: {
            color: KnowitColors.darkBrown,
            "& span": {
                fontWeight: "bold",
            },
        },
        actions: {
            display: "flex",
            alignItems: "center",
        },
        textField: {
            marginBottom: "16px",
            "& input": {
                color: KnowitColors.white,
            },
            "& textarea": {
                color: KnowitColors.white,
            },
            "& label": {
                color: KnowitColors.white,
            },
            "& fieldset": {
                color: KnowitColors.white,
                border: "2px solid #F3C8BA",
                borderRadius: "15px",
                transition: "border 100ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            },
        },
    })
);

const CategoryListItem = ({
    category: c,
    onClick,
    index: ind,
    moveCategory,
    saveCategory,
    deleteCategory,
    enableUpdates,
    categories,
}: any) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [text, setText] = useState<String>(c.text);
    const [description, setDescription] = useState<String>(c.description || "");
    const classes = useCategoryListItemStyles();

    const onSave = async () => {
        try {
            await saveCategory(c, text, description);
            setEditMode(false);
        } catch (e) {}
    };

    const onCancel = () => {
        setText(c.text);
        setDescription(c.description || "");
        setEditMode(false);
    };

    return editMode ? (
        <ListItem className={classes.listItemEdit}>
            <ListItemText
                primary={
                    <>
                        <TextField
                            fullWidth
                            label="Navn"
                            variant="outlined"
                            value={text}
                            className={classes.textField}
                            onChange={(e: any) => setText(e.target.value)}
                            error={text.length === 0}
                            helperText={
                                text.length === 0 &&
                                "Navnet på kategorien kan ikke være tomt."
                            }
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            rowsMax={6}
                            label="Beskrivelse"
                            variant="outlined"
                            value={description}
                            className={classes.textField}
                            onChange={(e: any) =>
                                setDescription(e.target.value)
                            }
                        />
                    </>
                }
                className={classes.listItemText}
            />
            <EditActionButtons
                disabled={text.length === 0}
                onSave={onSave}
                onCancel={onCancel}
            />
        </ListItem>
    ) : (
        <ListItem className={classes.listItem} onClick={onClick}>
            <ListItemText
                primary={`${ind + 1}. ${c.text}`}
                className={classes.listItemText}
            />
            <ListItemSecondaryAction className={classes.actions}>
                <IconButton
                    onClick={() => setEditMode(true)}
                    className={classes.button}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    onClick={() => deleteCategory(c)}
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
                        onClick={() => moveCategory(c, 1)}
                        className={classes.button}
                        disabled={!enableUpdates || ind === 0}
                    >
                        <KeyboardArrowUpIcon fontSize="small" />
                    </Button>
                    <Button
                        size="small"
                        onClick={() => moveCategory(c, -1)}
                        className={classes.button}
                        disabled={
                            !enableUpdates || ind === categories.length - 1
                        }
                    >
                        <KeyboardArrowDownIcon fontSize="small" />
                    </Button>
                </ButtonGroup>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default CategoryListItem;
