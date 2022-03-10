import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Fab, Tooltip, Modal, makeStyles } from "@material-ui/core";
import { KnowitColors } from "../styles";
import DescriptionTable from "./DescriptionTable";

const floatingScaleDescButtonStyleDesktop = makeStyles({
    fab: {
        alignSelf: "flex-end",
        width: "fit-content",
        marginRight: "20px",
        marginBottom: "20px",
        backgroundColor: KnowitColors.lightGreen,
        color: KnowitColors.darkBrown,
        position: "fixed",
        bottom: "0px",
        right: "0px",
        fontFamily: "Arial",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "11px",
        lineHeight: "13px",
        height: "35px",
        zIndex: 1301, // modal backdrop z-index + 1
    },
    fabMenu: {
        position: "absolute",
        alignSelf: "flex-end",
        marginRight: "20px",
        marginBottom: "10px",
        bottom: "55px",
        right: "0px",
        borderRadius: "50px 50px 0px 50px",
        backgroundColor: KnowitColors.lightGreen,
        width: "400px",
        // viewport height - headerbar height - bottom margin height - other spacing
        maxHeight: "calc(100vh - 66px - 55px - 20px)",
        boxShadow:
            "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
        "&:focus": {
            outline: "none",
        },
    },
    closeButton: {
        marginTop: "15px",
        marginRight: "20px",
        "&:hover": {
            color: KnowitColors.darkGreen,
        },
        float: "right",
        position: "absolute",
        right: "0px",
        top: "0px",
    },
    arrow: {
        width: "25px",
        height: "12.5px",
        position: "absolute",
        top: "100%",
        right: "5%",
        transform: "translateX(-50%)",
        overflow: "hidden",
        "&:after": {
            content: '""',
            position: "absolute",
            width: "10px",
            height: "10px",
            background: KnowitColors.lightGreen,
            transform: "translateX(-50%) translateY(-50%) rotate(45deg)",
            top: "0",
            left: "50%",
            boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.50)",
        },
    },
});

const floatingScaleDescButtonStyleMobile = makeStyles({
    arrow: {},
    fab: {
        alignSelf: "flex-end",
        marginRight: "10px",
        marginBottom: "10px",
        backgroundColor: KnowitColors.lightGreen,
        position: "fixed",
        bottom: "0px",
        right: "0px",
        fontFamily: "Arial",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "18px",
        lineHeight: "16px",
    },
    fabMenu: {
        position: "fixed",
        bottom: "0px",
        right: "0px",
        width: "100%",
        height: "100%",
        zIndex: 101,
        backgroundColor: KnowitColors.lightGreen,
        color: KnowitColors.darkBrown,
        boxShadow: "0px -4px 4px rgba(0, 0, 0, 0.15)",
        borderRadius: "50px 50px 0px 0px",
    },
    closeButton: {
        marginTop: "10px",
        marginRight: "15px",
        "&:hover": {
            color: KnowitColors.darkGreen,
        },
        float: "right",
        position: "absolute",
        right: "0px",
        top: "0px",
    },
});

type FloatingScaleDescButtonProps = {
    isMobile: boolean;
    scaleDescOpen: boolean;
    setScaleDescOpen: Dispatch<SetStateAction<boolean>>;
    firstTimeLogin: boolean;
};

type ConditionalWrapProps = {
    condition: boolean;
    wrap: (children: JSX.Element) => JSX.Element;
    children: JSX.Element;
};

const ConditionalWrap = ({ condition, wrap, children }: ConditionalWrapProps) =>
    condition ? wrap(children) : children;

const FloatingScaleDescButton = ({
    isMobile,
    scaleDescOpen,
    setScaleDescOpen,
    firstTimeLogin,
}: FloatingScaleDescButtonProps) => {
    const style = isMobile
        ? floatingScaleDescButtonStyleMobile()
        : floatingScaleDescButtonStyleDesktop();

    const [showTooltip, setShowTooltip] = useState(firstTimeLogin);
    useEffect(() => {
        if (firstTimeLogin) {
            setTimeout(() => setShowTooltip(false), 5000);
        }
    }, [firstTimeLogin]);

    const handleMobileFabClick = () => {
        setShowTooltip(false);
        setScaleDescOpen((scaleDescOpen) => !scaleDescOpen);
    };

    return (
        <>
            {scaleDescOpen && (
                <Modal
                    open={scaleDescOpen}
                    onClose={() =>
                        setScaleDescOpen((scaleDescOpen) => !scaleDescOpen)
                    }
                >
                    <div className={style.fabMenu}>
                        <DescriptionTable
                            onClose={() => setScaleDescOpen(false)}
                            isMobile={isMobile}
                        />
                        <div className={style.arrow}></div>
                    </div>
                </Modal>
            )}
            {isMobile ? (
                <ConditionalWrap
                    condition={firstTimeLogin}
                    wrap={(children) => (
                        <Tooltip
                            title="Trykk her for å se hva ikonene betyr!"
                            open={showTooltip}
                            arrow
                        >
                            {children}
                        </Tooltip>
                    )}
                >
                    <Fab
                        size="medium"
                        variant="round"
                        className={style.fab}
                        onClick={handleMobileFabClick}
                    >
                        ?
                    </Fab>
                </ConditionalWrap>
            ) : (
                <Fab
                    variant="extended"
                    className={style.fab}
                    onClick={() =>
                        setScaleDescOpen((scaleDescOpen) => !scaleDescOpen)
                    }
                >
                    SKALABESKRIVELSE
                </Fab>
            )}
        </>
    );
};

export default FloatingScaleDescButton;
