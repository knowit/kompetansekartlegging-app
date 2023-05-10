import { Auth, Hub } from 'aws-amplify'
import { Fragment, useEffect, useRef, useState } from 'react'
import './App.css'
// import awsconfig from "./aws-exports";
import { Button, Snackbar, debounce } from '@mui/material'
import {
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { QueryClientProvider } from '@tanstack/react-query'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import Content from './components/Content'
import FloatingScaleDescButton from './components/FloatingScaleDescButton'
import Login from './components/Login'
import NavBarDesktop from './components/NavBarDesktop'
import './config/aws-config'
import { queryClient } from './config/tanstack-config'
import {
  fetchOrganizationNameByID,
  selectUserState,
  setUserInfo,
  setUserInfoLogOut,
} from './redux/User'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { KnowitColors } from './styles'
import theme from './theme'

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const appStyle = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: isMobile ? 'auto' : '100vh',
    overflowY: isMobile ? 'hidden' : 'visible',
  },
  content: {
    height: '100%',
    flexGrow: 1,
  },
})

// Sometimes the cognito-object does not contain attributes. Not sure why
const cognitoUserContainsAttributes = (data: any): boolean => {
  return 'attributes' in data
}

const App = () => {
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserState)

  const { t } = useTranslation()
  const style = appStyle()
  const [showFab, setShowFab] = useState<boolean>(true)
  const [answerHistoryOpen, setAnswerHistoryOpen] = useState<boolean>(false)
  const [scaleDescOpen, setScaleDescOpen] = useState(false)
  const [firstTimeLogin, setFirstTimeLogin] = useState(false)

  useEffect(() => {
    const handleResize = debounce(() => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }, 100)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      console.log('Auth occured', event)
      switch (event) {
        case 'signIn':
          if (cognitoUserContainsAttributes(data)) {
            dispatch(setUserInfo(data))
            dispatch(fetchOrganizationNameByID(data))
          }
          break
        case 'signIn_failure':
          console.trace('Failed to sign in', event, data)
          break
        case 'signOut':
          dispatch(setUserInfoLogOut())
          break
      }
    })

    Auth.currentAuthenticatedUser()
      .then((res) => {
        if (cognitoUserContainsAttributes(res)) {
          Auth.currentSession().then((currentSession) => {
            res.refreshSession(currentSession.getRefreshToken(), () => {
              dispatch(setUserInfo(res))
              dispatch(fetchOrganizationNameByID(res))
            })
          })
        }
      })
      .catch(() => {
        console.log('Not signed in')
        dispatch(setUserInfoLogOut())
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isMobile) {
      // hide body overflow to avoid doublescroll
      if (scaleDescOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  }, [scaleDescOpen])

  const signout = () => {
    Auth.signOut()
  }

  const displayAnswers = () => {
    setAnswerHistoryOpen(true)
  }

  // SCROLL
  const mobileNavRef = useRef<HTMLInputElement>(null)
  const categoryNavRef = useRef<HTMLInputElement | null>(null)
  const [collapseMobileCategories, setCollapseMobileCategories] =
    useState<boolean>(false)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScroll = () => {
    if (categoryNavRef.current?.clientHeight !== undefined) {
      const menuHeight = categoryNavRef.current?.clientHeight - 56
      // Makes sure there is enough content to collapse; stops glitchy drag-scrolling past content
      if (
        document.body.clientHeight > window.innerHeight + menuHeight &&
        window.scrollY > menuHeight
      ) {
        setCollapseMobileCategories(true)
      } else {
        setCollapseMobileCategories(false)
      }
    }
  }

  const scrollToTopMobile = () => {
    if (categoryNavRef.current?.clientHeight) {
      window.scroll(0, categoryNavRef.current?.clientHeight - 50)
      setCollapseMobileCategories(true)
    }
  }
  const [bannerOpen, setBannerOpen] = useState(true)

  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <div className={style.root}>
            {import.meta.env.VITE_USER_BRANCH !== 'master' ? (
              <Snackbar
                open={bannerOpen}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <div
                  style={{
                    background: 'rgba(0,255,0, 255)',
                    borderRadius: 5,
                    padding: 4,
                    textAlign: 'center',
                  }}
                >
                  {t('thisIsATestEnvironment') + ' '}
                  <Button
                    onClick={() => setBannerOpen(false)}
                    style={{ color: KnowitColors.black }}
                  >
                    {t('close').toUpperCase()}
                  </Button>
                </div>
              </Snackbar>
            ) : null}
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
                  setCollapseMobileCategories={setCollapseMobileCategories}
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
      </StyledEngineProvider>
    </QueryClientProvider>
  )
}

export default App
