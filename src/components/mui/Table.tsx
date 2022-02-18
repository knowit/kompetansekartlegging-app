import { createStyles, withStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";

const StyledTable = withStyles((theme: Theme) =>
    createStyles({
        root: {
            borderCollapse: "collapse",
            borderStyle: "hidden",
            "& th": {
                fontWeight: "bold",
            },
            "& td, & th": {
                border: `1px solid ${theme.palette.divider}`,
            },
        },
        stickyHeader: {
            "& th": {
                backgroundClip: "padding-box",
            },
        },
    })
)(Table);

export default StyledTable;
