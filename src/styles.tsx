import { makeStyles, Theme } from "@material-ui/core";

export const cardCornerRadius: number = 40;

export const KnowitColors = {
    black: "#000000",
    white: "#FFFFFF",
    darkBrown: "#393939",
    creme: "#F1EEEE",
    beige: "#E4E0DC",
    green: "#52B469",
    darkGreen: "#596961",
    lightGreen: "#C3DEC3",
    ecaluptus: "#DFEDE1",
    greyGreen: "#ADB7AF",
    fuchsia: "#EA3FF3",
    burgunder: "#7A3E50",
    flamingo: "#F3C8BA",
    lightPink: "#F7E1DD",
};

export const AppStyle = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
    },
    content: {
        height: "100%",
        flexGrow: 1,
    },
});

export const dialogStyles = makeStyles(
    {
        searchField: {
            "& fieldset": {
                border: "2px solid #F3C8BA",
                borderRadius: "27px",
                transition: "border 100ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            },
        },
        textField: {
            "& fieldset": {
                border: "2px solid #F3C8BA",
                borderRadius: "13px",
                transition: "border 100ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            },
            margin: "0 8px 8px 0",
        },
        closeButton: {
            color: "black",
        },
        confirmButton: {
            width: "162px",
            height: "38px",
            border: "3px solid",
            background: KnowitColors.lightGreen,
            borderRadius: "19px",
            borderColor: KnowitColors.lightGreen,
        },
        cancelButton: {
            width: "162px",
            height: "38px",
            border: "3px solid",
            borderColor: KnowitColors.flamingo,
            boxsizing: "border-box",
            borderRadius: "19px",
        },
        buttonText: {
            fontWeight: "bold",
            textTransform: "none",
            lineHeight: 1,
        },
        errorIcon: {
            fill: KnowitColors.fuchsia,
            height: "38px",
            width: "38px",
            marginRight: "8px",
        },
        alertText: {
            color: "black",
        },
        alertButtons: {
            justifyContent: "space-evenly",
            marginBottom: "10px",
        },
        dialogTitle: {
            "& h2": {
                display: "flex",
            },
        },
        dialogTitleText: {
            fontWeight: "bold",
            marginTop: "4px",
        },
    },
    { index: 1 }
);

export const FontSettings = makeStyles({
    lighter: {
        fontWeight: "lighter",
    },
    normal: {
        fontWeight: "normal",
    },
    bold: {
        fontWeight: "bold",
    },
    bolder: {
        fontWeight: "bolder",
    },
    sizeSmall: {
        fontSize: 8,
    },
});

type ZProps = {
    zIndex: number;
};

export const CardStyle = makeStyles<Theme, ZProps>((theme: Theme) => ({
    cardButton: {
        fontWeight: "bold",
        fontSize: 18,
        padding: 10,
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        textAlign: "left",
        paddingLeft: 50,
        width: "100%",
    },
    cardHolder: {
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
    },
    closed: {
        position: "relative",
        marginTop: -cardCornerRadius,
        boxShadow: "0px 3px 2px grey",
        borderBottomLeftRadius: cardCornerRadius,
        borderBottomRightRadius: cardCornerRadius,
        zIndex: ({ zIndex }) => zIndex,
    },
    open: {
        position: "relative",
        marginTop: -cardCornerRadius,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        // flexGrow: 1
        height: "100%",
        boxShadow: "0px 3px 2px grey",
        borderBottomLeftRadius: cardCornerRadius,
        borderBottomRightRadius: cardCornerRadius,
        zIndex: ({ zIndex }) => zIndex,
    },
    bottomCardClosed: {
        // position: 'relative',
        //marginTop: cardCornerRadius,
        // boxShadow: "0px 3px 2px grey",
        // borderBottomLeftRadius: cardCornerRadius,
        // borderBottomRightRadius: cardCornerRadius,
        zIndex: ({ zIndex }) => zIndex,
        // backgroundColor: KnowitColors.darkGreen
    },
    bottomCardOpen: {
        position: "relative",
        marginTop: -cardCornerRadius,
        display: "flex",
        flexDirection: "row",
        overflowY: "auto",
        // flexGrow: 1
        height: "100%",
        // boxShadow: "0px 3px 2px grey",
        // borderBottomLeftRadius: cardCornerRadius,
        // borderBottomRightRadius: cardCornerRadius,
        zIndex: ({ zIndex }) => zIndex,
    },
}));

export const OverviewStyle = makeStyles({
    root: {
        maxHeight: "40%",
        width: "100%",
        backgroundColor: KnowitColors.white,
    },
    radarPlot: {
        height: "100%",
        width: "100%",
        display: "flex",
        overflowY: "auto",
        justifyContent: "center",
    },
    cardHeader: {
        display: "flex",
        marginTop: cardCornerRadius,
        height: cardCornerRadius,
    },
    closeButton: {
        marginTop: "3px",
        marginRight: "32px",
        "&:hover": {
            color: KnowitColors.darkGreen,
        },
    },
    empty: {
        display: "none",
    },
});

export const ScaleDescStyle = makeStyles({
    root: {
        maxHeight: "32%",
        width: "100%",
        backgroundColor: KnowitColors.ecaluptus,
    },
    cardHeader: {
        display: "flex",
        marginTop: cardCornerRadius,
        height: cardCornerRadius,
    },
    closeButton: {
        marginTop: "3px",
        marginRight: "32px",
        "&:hover": {
            color: KnowitColors.darkGreen,
        },
    },
});

// export const AnswersStyle = makeStyles({
//     root: {
//         display: 'flex',
//         flexDirection: 'column',
//         width: "100%",
//         backgroundColor: KnowitColors.greyGreen
//     },
//     header: {
//     },
//     form: {
//         flexGrow: 2,
//         flex: '0 1 auto',
//         overflowY: 'auto',
//         height: '100%'
//     }
// });

// export const QuestionBlock = makeStyles({
//     root: {
//         marginTop: 10,
//         marginLeft: 10,
//         marginRight: 10,
//         backgroundColor: KnowitColors.ecaluptus
//     },
//     categoryGroup: {
//         // marginTop: 10,
//         paddingBottom: 10,
//         backgroundColor: KnowitColors.lightGreen,
//         width: '100%'
//     },
//     categoryText: {
//         fontSize: 22,
//         fontWeight: 'bold'
//     },
//     topic: {
//         fontWeight: "bold"
//     },
//     sliderGroup: {
//         display: 'flex',
//         flexWrap: "nowrap",
//         justifyContent: 'flex-start',
//         alignItems: 'center'
//     },
//     smallBold: {
//         fontSize: 14,
//         fontWeight: "bold"
//     },
//     largeBold: {
//         fontSize: 18,
//         fontWeight: "bold"
//     }
// });

export const DescTableStyle = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: KnowitColors.ecaluptus,
    },
    scaleRow: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignContent: "center",
    },
    scaleTitle: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 2,
        justifyContent: "center",
        fontWeight: "bold",
        textAlign: "center",
        width: "10%",
    },
    container: {
        display: "flex",
        flex: 1,
        flexGrow: 5,
        flexDirection: "column",
        padding: 5,
    },
    top: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 10,
        paddingBottom: 20,
    },
    bottom: {
        display: "flex",
    },
    iconArea: {
        height: 30,
        paddingRight: 5,
    },
    icon: {
        height: "100%",
    },
    textBlock: {
        display: "flex",
        flexDirection: "column",
    },
    heading: {
        textAlign: "left",
        fontSize: 10,
        fontWeight: "bold",
    },
    text: {
        textAlign: "left",
        fontSize: 10,
    },
});

export const HighlightsStyle = makeStyles({
    root: {
        display: "flex",
        width: "30%",
        flexDirection: "column",
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        paddingBottom: 20,
    },
    container: {
        display: "flex",
        justifyContent: "center",
    },
    col: {
        display: "flex",
        width: "40%",
        flexDirection: "column",
    },
    heading: {
        textAlign: "left",
        paddingBottom: 10,
    },
    list: {
        display: "flex",
        flexDirection: "column",
    },
    listitem: {
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: 5,
    },
    icon: {
        width: "15%",
        fill: KnowitColors.darkBrown,
    },
    topic: {
        width: "80%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontSize: 12,
    },
});
