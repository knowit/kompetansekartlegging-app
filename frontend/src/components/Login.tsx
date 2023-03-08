import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Button, makeStyles } from '@material-ui/core'
import { Auth } from 'aws-amplify'
import { useState } from 'react'
import { ReactComponent as KnowitLogo } from '../Logotype-Knowit-Digital-white 1.svg'
import { KnowitColors } from '../styles'

const loginStyle = makeStyles({
  container: {
    height: 'calc(var(--vh, 1vh) * 100)',
    width: '100vw',
    position: 'relative',
    fontFamily: 'Arial',
    overflow: 'hidden',
  },
  topDiv: {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    background: KnowitColors.white,
  },
  midDiv: {
    width: '100%',
    position: 'absolute',
    zIndex: 2,
    height: '70%',
    top: '30%',
    background: KnowitColors.beige,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  botDiv: {
    width: '100%',
    position: 'absolute',
    zIndex: 3,
    height: '66%',
    top: '34%',
    background: KnowitColors.darkBrown,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  frontDiv: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headlineAlign: {
    height: '15%',
  },
  headline: {
    fontSize: 30,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    color: KnowitColors.darkBrown,
  },
  headlineMobile: {
    fontSize: 20,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    color: KnowitColors.darkBrown,
  },
  buttonAlign: {
    height: '35%',
  },
  loginButton: {
    padding: 8,
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: 50,
    background: KnowitColors.lightGreen,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    fontSize: 15,
    '&:hover': {
      background: KnowitColors.green,
    },
    fontWeight: 'bold',
    textTransform: 'none',
    color: KnowitColors.darkBrown,
  },
  dot: {
    height: '0.6em',
    width: '0.6em',
    borderRadius: '50%',
    marginRight: 10,
    backgroundColor: KnowitColors.fuchsia,
  },
  logo: {
    postion: 'absolute',
    zIndex: 5,
    width: 80,
  },
  hidden: {
    display: 'none',
  },
  authenticator: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
})

const userBranch = process ? process.env.REACT_APP_USER_BRANCH : ''
const isNotProd = userBranch !== 'master'
const Login = (props: { isMobile: boolean }) => {
  // console.log("/tree/", userBranch, isNotProd);
  const style = loginStyle()
  const [showDevLogin, setShowDevLogin] = useState<boolean>(false)
  const formFields = {
    signUp: {
      name: {
        order: 1,
      },
      email: {
        order: 2,
      },
      password: {
        order: 3,
      },
      confirm_password: {
        order: 4,
      },
    },
  }

  return showDevLogin ? (
    <Authenticator
      formFields={formFields}
      signUpAttributes={['name']}
      variation="default"
      loginMechanisms={['email']}
      className={style.authenticator}
      /*socialProviders={["amazon"]}*/
    />
  ) : (
    <div className={style.container}>
      <div className={style.topDiv} />
      <div className={style.midDiv} />
      <div className={style.botDiv}>
        <div className={props.isMobile ? style.logo : style.hidden}>
          <KnowitLogo className={style.logo} />
        </div>
      </div>
      <div className={style.frontDiv}>
        <div className={style.headlineAlign}>
          <h1
            className={props.isMobile ? style.headlineMobile : style.headline}
          >
            <div className={style.dot} />
            Kompetansekartlegging
          </h1>
        </div>
        <div className={style.buttonAlign}>
          <Button
            className={style.loginButton}
            onClick={() =>
              Auth.federatedSignIn({
                customProvider: 'AzureAD',
              })
            }
          >
            Logg inn
          </Button>
          {isNotProd && (
            <Button
              className={style.loginButton}
              onClick={() => setShowDevLogin(true)}
            >
              Dev login
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
