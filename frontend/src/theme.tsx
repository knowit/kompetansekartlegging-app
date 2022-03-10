import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";
import { KnowitColors } from "./styles";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: KnowitColors.lightGreen,
        },
        secondary: {
            main: KnowitColors.fuchsia,
        },
    },
});

export default theme;
