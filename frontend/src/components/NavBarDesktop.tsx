import {
    AppBar,
    Button,
    Toolbar,
    Avatar,
    MenuItem,
    ClickAwayListener,
    Popper,
    Grow,
    Paper,
    MenuList,
} from "@material-ui/core";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import { KnowitColors } from "../styles";
import { NavBarPropsDesktop } from "../types";
import { ReactComponent as KnowitLogo } from "../Logotype-Knowit-Digital-white 1.svg";
import { useSelector } from "react-redux";
import { selectUserState } from "../redux/User";


const navbarStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        zIndex: 100,
    },
    navigation: {
        flexGrow: 1,
    },
    logoutButton: {
        marginRight: theme.spacing(2),
    },
    button: {
        width: "100px",
    },
    header: {
        color: KnowitColors.white,
        backgroundColor: KnowitColors.darkBrown,
    },
    userName: {
        margin: "5px",
        fontFamily: "Arial",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "20px",
        lineHeight: "23px",
        color: KnowitColors.white,
    },
    dropdownMenuButton: {
        marginLeft: "auto",
    },
    dropdownMenu: {
        backgroundColor: KnowitColors.beige,
        color: KnowitColors.darkBrown,
    },
    userPicture: {
        margin: "5px",
        width: "44px",
        height: "44px",
    },
    logo: {},
    title: {
        fontFamily: "Arial",
        fontSize: "25px",
        fontStyle: "normal",
        fontWeight: "bold",
        paddingLeft: 20,
    },
}));

const NavBarDesktop = ({ ...props }: NavBarPropsDesktop) => {
    const userState = useSelector(selectUserState);

    const [avatarMenuOpen, setAvatarMenuOpen] = useState<boolean>(false);
    // return focus to the button when we transitioned from !avatarMenuOpen -> avatarMenuOpen
    const avatarMenuPrevOpen = React.useRef(avatarMenuOpen);
    const style = navbarStyles();

    const [deleteAlertOpen, setDeleteAlertOpen] = useState<boolean>(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setAvatarMenuOpen((avatarMenuPrevOpen) => !avatarMenuPrevOpen);
    };

    const handleClose = (event: React.MouseEvent<EventTarget>) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setAvatarMenuOpen(false);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Tab") {
            event.preventDefault();
            setAvatarMenuOpen(false);
        }
    }

    const handleCloseSignout = (event: React.MouseEvent<EventTarget>) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        props.signout();
    };

    // const handleDeleteAnswers = (event: React.MouseEvent<EventTarget>) => {
    //     if (
    //         anchorRef.current &&
    //         anchorRef.current.contains(event.target as HTMLElement)
    //     ) {
    //         return;
    //     }
    //     setDeleteAlertOpen(true);
    // };

    const handleCloseAlert = () => {
        setDeleteAlertOpen(false);
    };

    // const handleDisplayAnswers = (event: React.MouseEvent<EventTarget>) => {
    //     if (
    //         anchorRef.current &&
    //         anchorRef.current.contains(event.target as HTMLElement)
    //     ) {
    //         return;
    //     }
    //     props.displayAnswers();
    //     // setAvatarMenuOpen(false);
    // };

    useEffect(() => {
        if (avatarMenuPrevOpen.current === true && avatarMenuOpen === false) {
            anchorRef.current!.focus();
        }

        avatarMenuPrevOpen.current = avatarMenuOpen;
    }, [avatarMenuOpen]);

    return (
        <div className={style.root}>
            <AppBar position="static">
                <Toolbar className={style.header}>
                    <div className={style.logo}>
                        <KnowitLogo />
                    </div>
                    <h1 className={style.title}>Kompetansekartlegging for {userState.organizationName}</h1>

                    {/* <Button variant="contained" className={classes.logoutButton} onClick={() => Auth.signOut()}>Sign out</Button>  */}
                    <div className={style.dropdownMenuButton}>
                        <Button
                            ref={anchorRef}
                            aria-controls={
                                avatarMenuOpen ? "menu-list-grow" : undefined
                            }
                            aria-haspopup="true"
                            onClick={handleToggle}
                            aria-label="Toggle dropdownmenu"
                        >
                            <div className={style.userName}>
                                {userState.name}
                            </div>
                            <Avatar
                                className={style.userPicture}
                                src={userState.picture}
                                alt="Profile Picture"
                            />
                        </Button>
                        <Popper
                            open={avatarMenuOpen}
                            anchorEl={anchorRef.current}
                            placement={"bottom-end"}
                            role={undefined}
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === "bottom"
                                                ? "center top"
                                                : "center bottom",
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener
                                            onClickAway={handleClose}
                                        >
                                            <MenuList
                                                autoFocusItem={avatarMenuOpen}
                                                id="menu-list-grow"
                                                onKeyDown={handleListKeyDown}
                                                className={style.dropdownMenu}
                                            >
                                                {/* Removed for user testing
                                        <MenuItem onClick={handleDisplayAnswers}>Vis alle lagrede svar</MenuItem>
                                        <MenuItem onClick={handleDeleteAnswers}>Slett alle svar</MenuItem> */}
                                                <MenuItem
                                                    onClick={handleCloseSignout}
                                                >
                                                    Logg ut
                                                </MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                        <Dialog
                            open={deleteAlertOpen}
                            onClose={handleCloseAlert}
                            aria-labelledby="dialogtitle"
                            aria-describedby="dialogdescription"
                        >
                            <DialogTitle id="dialogtitle">
                                {"Ønsker du å slette svarene dine?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="dialogdescription">
                                    OBS: Dette vil slette alle innsendte og
                                    lagrede svar!
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => 1} color="primary">
                                    Bekreft
                                </Button>
                                <Button
                                    onClick={handleCloseAlert}
                                    color="primary"
                                    autoFocus
                                >
                                    Avbryt
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default NavBarDesktop;
