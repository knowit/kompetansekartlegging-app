import React from "react"
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
});

const PictureAndNameCell = ({ name, picture }: any) => {
    const classes = useStyles();

    return (
        <span className={classes.root}>
            <Avatar alt={name} src={picture} />
            {name}
        </span>
    );
};

export default PictureAndNameCell
