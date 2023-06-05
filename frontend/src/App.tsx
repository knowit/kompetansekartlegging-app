import { useEffect, useRef, useState } from 'react'
import './App.css'
import { API, Auth, Hub } from 'aws-amplify'
import awsconfig from './exports'
import Content from './components/Content'
import Login from './components/Login'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { Button, debounce, Snackbar, Alert } from '@mui/material'
import { useWindowDimensions } from './helperFunctions'
import FloatingScaleDescButton from './components/FloatingScaleDescButton'
import theme from './theme'
import {
  setUserInfo,
  setUserInfoLogOut,
  selectUserState,
  fetchOrganizationNameByID,
} from './redux/User'
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'
import { useAppSelector, useAppDispatch } from './redux/hooks'
import { useTranslation } from 'react-i18next'

const userBranch = import.meta.env.VITE_USER_BRANCH

switch (userBranch) {
  case 'master':
    awsconfig.oauth.domain = 'auth.kompetanse.knowit.no'
    break
  case 'dev':
    awsconfig.oauth.domain = 'auth.dev.kompetanse.knowit.no'
    break
  default:
    break
}

awsconfig.oauth.redirectSignIn = `${window.location.origin}/`
awsconfig.oauth.redirectSignOut = `${window.location.origin}/`

API.configure(awsconfig)
Auth.configure(awsconfig)

Hub.listen(/.*/, (data) => {
  console.log('Hub listening to all messages: ', data)
  if (data.payload.event === 'signIn_failure') {
    const message = data.payload.data.message
    if (message.includes('Google') && !message.includes('organization')) {
      Auth.federatedSignIn({
        customProvider: CognitoHostedUIIdentityProvider.Google,
      })
    } else if (
      message.includes('AzureAD') &&
      !message.includes('organization')
    ) {
      Auth.federatedSignIn({
        customProvider: 'AzureAD',
      })
    }
  }
})

// Sometimes the cognito-object does not contain attributes. Not sure why
const cognitoUserContainsAttributes = (data: any): boolean => {
  return 'attributes' in data
}

const App = () => {
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserState)

  const { t } = useTranslation()
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

  const { width } = useWindowDimensions()
  const isSmall = width < 700

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
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {userBranch !== 'master' ? (
          <Snackbar
            open={bannerOpen}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="warning">
              {t('thisIsATestEnvironment') + ' '}
              <Button onClick={() => setBannerOpen(false)}>{t('close')}</Button>
            </Alert>
          </Snackbar>
        ) : null}

        {userState.isSignedIn ? (
          <>
            <Content
              signout={signout}
              displayAnswers={displayAnswers}
              setAnswerHistoryOpen={setAnswerHistoryOpen}
              answerHistoryOpen={answerHistoryOpen}
              isSmall={isSmall}
              collapseMobileCategories={collapseMobileCategories}
              categoryNavRef={categoryNavRef}
              mobileNavRef={mobileNavRef}
              scrollToTop={scrollToTopMobile}
              setCollapseMobileCategories={setCollapseMobileCategories}
              setFirstTimeLogin={setFirstTimeLogin}
              firstTimeLogin={firstTimeLogin}
              setShowFab={setShowFab}
            />
            {showFab && (
              <FloatingScaleDescButton
                scaleDescOpen={scaleDescOpen}
                setScaleDescOpen={setScaleDescOpen}
                firstTimeLogin={firstTimeLogin}
                isSmall={isSmall}
              />
            )}
          </>
        ) : (
          <Login isSmall={isSmall} />
        )}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
