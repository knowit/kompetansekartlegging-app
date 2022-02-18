import React from "react";
import {
    createStyles,
    withStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { KnowitColors } from "../../../styles";

const BootstrapInput = withStyles((theme: Theme) =>
    createStyles({
        root: {
            "& svg": {
                color: KnowitColors.white,
            }
        },
        input: {
            borderRadius: "15px",
            position: "relative",
            color: KnowitColors.white,
            border: `2px solid ${KnowitColors.flamingo}`,
            fontSize: 16,
            padding: "16px 50px 16px 10px",
            transition: theme.transitions.create([
                "border-color",
                "box-shadow",
            ]),
            fontFamily: [
                "-apple-system",
                "BlinkMacSystemFont",
                '"Segoe UI"',
                "Roboto",
                '"Helvetica Neue"',
                "Arial",
                "sans-serif",
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(","),
            "&:focus": {
                borderRadius: "15px",
                borderColor: "#80bdff",
                boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
            },
        },
    })
)(InputBase);

const useStyles = makeStyles(() =>
    createStyles({
        formControl: {
            margin: "0 0 16px 16px",
            minWidth: 180,
            maxWidth: 180,
        },
        label: {
            color: KnowitColors.white,
            pointerEvents: "none",
            backgroundColor: KnowitColors.darkBrown,
            padding: "0 8px 0 4px",
        }
    })
);

const CategoriesSelect = ({ categories, categoryID, setCategoryID }: any) => {
    const classes = useStyles();
    // const category = categories.find((c: any) => c.id === categoryID);

    return (
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel className={classes.label}>Kategori</InputLabel>
            <Select
                value={categoryID}
                onChange={(e) => setCategoryID(e.target.value)}
                input={<BootstrapInput />}
            >
                {categories.map((c: any) => (
                    <MenuItem key={c.id} value={c.id}>
                        {c.text}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CategoriesSelect;
