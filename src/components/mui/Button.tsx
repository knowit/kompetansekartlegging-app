import { createStyles, withStyles } from "@material-ui/core/styles";
import Button, {
    ButtonProps as MuiButtonProps,
} from "@material-ui/core/Button";
import { KnowitColors } from "../../styles";

const StyledButton = withStyles(() =>
    createStyles({
        root: {
            fontWeight: (props: MuiButtonProps) =>
                props.color === "primary" || props.color === "secondary"
                    ? "bold"
                    : "normal",
            textTransform: "none",
            margin: (props: MuiButtonProps) => {
                switch (props.color) {
                    case "primary":
                        return "24px 0";
                    default:
                        return "";
                }
            },
            boxShadow: "none",
            border: (props: MuiButtonProps) => {
                switch (props.color) {
                    case "primary":
                        return "3px solid";
                    default:
                        return "";
                }
            },
            borderRadius: (props: MuiButtonProps) => {
                switch (props.color) {
                    case "primary":
                        return "19px";
                    default:
                        return "";
                }
            },
            borderColor: (props: MuiButtonProps) => {
                switch (props.color) {
                    case "primary":
                        return KnowitColors.lightGreen;
                    default:
                        return "";
                }
            },
            "&:hover": {
                boxShadow: "none",
                textDecoration: "none",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
        },
    })
)(Button);

export default StyledButton;
