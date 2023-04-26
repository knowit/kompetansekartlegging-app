import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Button } from '@mui/material'
import { Auth } from 'aws-amplify'
import { useState } from 'react'
import { ReactComponent as KnowitLogo } from '../Logotype-Knowit-Digital-white 1.svg'
import { useTranslation } from 'react-i18next'
import { LanguageSelect } from './LanguageSelect'
import { KnowitColors } from '../styleconstants'
import { minPanelWidth, maxPanelWidth } from '../styleconstants'
import styled from '@emotion/styled'

interface IsSmallProp {
  isSmall: boolean
}

const StyledLoginContainer = styled.div`
  display: grid;
  grid-template-columns:
    minmax(10px, auto) minmax(${minPanelWidth}px, ${maxPanelWidth}px)
    minmax(10px, auto);

  grid-template-rows: 1fr 5fr 1fr;

  main {
    grid-column: 2;
    grid-row: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;

    #heading {
      grid-column: 1;
      align-self: center;
      svg {
        path {
          fill: black;
        }
      }
    }

    #devLogin {
      grid-column: ${(props: IsSmallProp) => (props.isSmall ? '1' : '2')};
    }
  }

  #languageSelect {
    grid-column: ${(props: IsSmallProp) => (props.isSmall ? '2' : '1')};
  }
`

const formFields = {
  signUp: {
    name: {
      order: 1,
      isRequired: true,
    },
    email: {
      order: 2,
      isRequired: true,
    },
    password: {
      order: 3,
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      isRequired: true,
    },
  },
}

const userBranch = import.meta.env.VITE_USER_BRANCH
const isNotProd = userBranch !== 'master'

const Login = ({ isSmall }: IsSmallProp) => {
  const { t } = useTranslation()
  const [showDevLogin, setShowDevLogin] = useState<boolean>(false)

  return (
    <StyledLoginContainer isSmall={isSmall}>
      <header id="languageSelect">
        <LanguageSelect color={KnowitColors.darkBrown} />
      </header>

      <main>
        <aside id="heading">
          <KnowitLogo />
          <h1>{t('login.competenceMapping')}</h1>

          <section id="loginButtons">
            <Button
              onClick={() =>
                Auth.federatedSignIn({
                  customProvider: 'AzureAD',
                })
              }
            >
              {t('login.signIn')}
            </Button>

            {isNotProd && (
              <Button onClick={() => setShowDevLogin(true)}>
                {t('login.devSignIn')}
              </Button>
            )}
          </section>
        </aside>

        <section id="devLogin">
          {showDevLogin && (
            <Authenticator
              formFields={formFields}
              signUpAttributes={['name']}
              variation="default"
              loginMechanisms={['email']}
            />
          )}
        </section>
      </main>
    </StyledLoginContainer>
  )
}

export default Login
