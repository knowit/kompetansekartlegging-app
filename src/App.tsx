import React, { Fragment, useEffect, useRef, useState } from "react";
import "./App.css";
import {Amplify,  API, Auth, Hub } from "aws-amplify";
import awsconfig from "./aws-exports";
import Content from "./components/Content";
import Login from "./components/Login";
import { ThemeProvider } from "@material-ui/core/styles";
import { Button, debounce, makeStyles, Snackbar } from "@material-ui/core";
import { isMobile } from "react-device-detect";
import FloatingScaleDescButton from "./components/FloatingScaleDescButton";
import NavBarDesktop from "./components/NavBarDesktop";
import theme from "./theme";

// redux
import { useSelector, useDispatch } from 'react-redux';
import { setUserInfo, setUserInfoLogOut, selectUserState, fetchOrganizationNameByID } from './redux/User';
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";

const userBranch = process.env.REACT_APP_USER_BRANCH;
// console.log("Hosted branch: ", userBranch);

switch(userBranch) {
    case "master":
        awsconfig.oauth.domain = "auth.kompetanse.knowit.no";
        break;
    case "dev":
        awsconfig.oauth.domain = "auth.dev.kompetanse.knowit.no";
        break;
    default:
        break;
}

awsconfig.oauth.redirectSignIn = `${window.location.origin}/`;
awsconfig.oauth.redirectSignOut = `${window.location.origin}/`;

// let config = Amplify.configure(awsconfig);
// console.log(config);
API.configure(awsconfig);
Auth.configure(awsconfig);

Hub.listen(/.*/, (data) => {
    console.log('Hub listening to all messages: ', data);
    if (data.payload.event === "signIn_failure") {
        let message = data.payload.data.message; 
        if (message.includes("Google")) {
            Auth.federatedSignIn({
                customProvider:
                    CognitoHostedUIIdentityProvider.Google,
            });
        } else if (message.includes("AzureAD")) {
            // console.log("Failure in the membrane");
            Auth.federatedSignIn({
                customProvider:
                    "AzureAD",
            });
        }
        // Auth.federatedSignIn();
    }
});

const appStyle = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        height: isMobile ? "auto" : "100vh",
        overflowY: isMobile ? "hidden" : "visible",
    },
    content: {
        height: "100%",
        flexGrow: 1,
    },
});

// Sometimes the cognito-object does not contain attributes. Not sure why
const cognitoUserContainsAttributes = (data:any) : boolean => {
    return 'attributes' in data;
};

const App = () => {
    const dispatch = useDispatch();
    const userState = useSelector(selectUserState);

    const style = appStyle();
    const [showFab, setShowFab] = useState<boolean>(true);
    const [answerHistoryOpen, setAnswerHistoryOpen] = useState<boolean>(false);
    const [scaleDescOpen, setScaleDescOpen] = useState(false);
    const [firstTimeLogin, setFirstTimeLogin] = useState(false);

    useEffect(() => {
        const handleResize = debounce(() => {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        }, 100);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        Hub.listen("auth", ({ payload: { event, data } }) => {
            console.log("Auth occured", event);
            switch (event) {
                case "signIn":
                    if(cognitoUserContainsAttributes(data)){
                        dispatch(setUserInfo(data));
                        dispatch(fetchOrganizationNameByID(data));
                    }
                    break;
                case "signIn_failure":
                    console.trace("Failed to sign in", event, data);
                    break;
                case "signOut":
                    dispatch(setUserInfoLogOut());
                    break;
            }
        });
        Auth.currentAuthenticatedUser()
            .then((res) => {
                if(cognitoUserContainsAttributes(res)){
                    dispatch(setUserInfo(res));
                    dispatch(fetchOrganizationNameByID(res));
                }
            })
            .catch(() => {
                console.log("Not signed in");
                dispatch(setUserInfoLogOut());
            });
    }, []);

    useEffect(() => {
        if (isMobile) {
            // hide body overflow to avoid doublescroll
            if (scaleDescOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        }
    }, [scaleDescOpen]);

    const signout = () => {
        Auth.signOut();
    };

    const displayAnswers = () => {
        setAnswerHistoryOpen(true);
    };

    // SCROLL
    const mobileNavRef = useRef<HTMLInputElement>(null);
    const categoryNavRef = useRef<HTMLInputElement | null>(null);
    const [
        collapseMobileCategories,
        setCollapseMobileCategories,
    ] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScroll = () => {
        if (categoryNavRef.current?.clientHeight !== undefined) {
            let menuHeight = categoryNavRef.current?.clientHeight - 56;
            // Makes sure there is enough content to collapse; stops glitchy drag-scrolling past content
            if (
                document.body.clientHeight > window.innerHeight + menuHeight &&
                window.scrollY > menuHeight
            ) {
                setCollapseMobileCategories(true);
            } else {
                setCollapseMobileCategories(false);
            }
        }
    };

    const scrollToTopMobile = () => {
        if (categoryNavRef.current?.clientHeight) {
            window.scroll(0, categoryNavRef.current?.clientHeight - 50);
            setCollapseMobileCategories(true);
        }
    };
    const [bannerOpen, setBannerOpen] = useState(true);

    return (
        <ThemeProvider theme={theme}>
            <div className={style.root}>
                 {(userBranch !== "master") ? <Snackbar open={bannerOpen} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                    <div style= {{
                        background:"rgba(255,127,80, 255)",
                        borderRadius:5,
                        padding: 4,
                        textAlign:"center"
                    }}>
                    NB: Dette er et test miljø!  <Button onClick={() => setBannerOpen(false)}>Close</Button>
                    </div>
                </Snackbar> : null}
                {userState.isSignedIn ? (
                    <Fragment>
                        {isMobile ? null : (
                            <NavBarDesktop
                                displayAnswers={displayAnswers}
                                signout={signout}
                            />
                        )}

                        <Content
                            setAnswerHistoryOpen={setAnswerHistoryOpen}
                            answerHistoryOpen={answerHistoryOpen}
                            isMobile={isMobile}
                            signout={signout}
                            collapseMobileCategories={collapseMobileCategories}
                            categoryNavRef={categoryNavRef}
                            mobileNavRef={mobileNavRef}
                            scrollToTop={scrollToTopMobile}
                            setCollapseMobileCategories={
                                setCollapseMobileCategories
                            }
                            setScaleDescOpen={setScaleDescOpen}
                            setFirstTimeLogin={setFirstTimeLogin}
                            setShowFab={setShowFab}
                        />
                        {showFab && (
                            <FloatingScaleDescButton
                                scaleDescOpen={scaleDescOpen}
                                setScaleDescOpen={setScaleDescOpen}
                                firstTimeLogin={firstTimeLogin}
                                isMobile={isMobile}
                            />
                        )}
                    </Fragment>
                ) : (
                    <Login isMobile={isMobile} />
                )}
            </div>
        </ThemeProvider>
    );
};

export default App;
