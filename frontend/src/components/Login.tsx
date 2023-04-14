import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Button } from '@mui/material'
import { Auth } from 'aws-amplify'
import { useState } from 'react'
import { ReactComponent as KnowitLogo } from '../Logotype-Knowit-Digital-white 1.svg'
import { useTranslation } from 'react-i18next'
import { LanguageSelect } from './LanguageSelect'
import { KnowitColors } from '../styles'

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
const Login = ({ ...props }) => {
  const { t } = useTranslation()
  const [showDevLogin, setShowDevLogin] = useState<boolean>(false)

  return showDevLogin ? (
    <>
      <div>
        <LanguageSelect iconColor={KnowitColors.darkBrown} />
      </div>
      <Authenticator
        formFields={formFields}
        signUpAttributes={['name']}
        variation="default"
        loginMechanisms={['email']}

        /*socialProviders={["amazon"]}*/
      />
    </>
  ) : (
    <div>
      <div />
      <div />
      <div>
        <div>
          <KnowitLogo />
        </div>
      </div>
      <div>
        <div>
          <LanguageSelect iconColor={KnowitColors.darkBrown} />
        </div>
        <div>
          <h1>
            <div />
            {t('login.competenceMapping')}
          </h1>
        </div>
        <div>
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
        </div>
      </div>
    </div>
  )
}

export default Login
