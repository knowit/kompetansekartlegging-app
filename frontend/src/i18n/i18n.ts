import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { English } from './locales/en'
import { Norwegian } from './locales/no'
import { ReactComponent as NorwegianFlag } from './flags/Norway.svg'
import { ReactComponent as UnitedKingdomFlag } from './flags/UnitedKingdom.svg'
import { I18n as amplifyI18n } from 'aws-amplify'
import { AuthErrorStrings } from '@aws-amplify/auth'

/*
To add a new language, add:
  - A new language file in 'frontend/i18n/locales'
  - A flag in svg format symbolizing the language in 'frontend/i18n/flags'
  - A new folder & help.md file in 'frontend/markdown'
  - The language and svg file to the availableLanguages below
  - The language to the init method below
  - A case in the i18nDateToLocaleDateString & i18nDateToLocaleString methods below
*/

type languageType = {
  nativeName: string
  flag: React.FunctionComponent
}

export const availableLanguages: Record<string, languageType> = {
  en: { nativeName: 'ENGLISH', flag: UnitedKingdomFlag },
  no: { nativeName: 'NORSK', flag: NorwegianFlag },
}

i18next.use(initReactI18next).init({
  debug: false,
  fallbackLng: 'en',
  resources: {
    en: English,
    no: Norwegian,
  },
})

const locallyStoredLanguage = localStorage.getItem('language')
if (locallyStoredLanguage) {
  i18next.changeLanguage(locallyStoredLanguage)
} else {
  i18next.changeLanguage('no')
}

// Date only
export const i18nDateToLocaleDateString = (date: Date) => {
  switch (i18next.language) {
    case 'no':
      return date.toLocaleDateString('nb-NO')
    default:
      return date.toLocaleDateString('en-GB')
  }
}

// Date and time
export const i18nDateToLocaleString = (date: Date) => {
  switch (i18next.language) {
    case 'no':
      return date.toLocaleString('nb-NO')
    default:
      return date.toLocaleString('en-GB')
  }
}

// i18n for Amplify Authenticator component
/* eslint-disable */
Object.keys(availableLanguages).forEach((language: string) => {
  amplifyI18n.putVocabulariesForLanguage(language, {
    Name: i18next.t('name', { lng: language }),
    Email: i18next.t('email', { lng: language }),
    Password: i18next.t('login.password', { lng: language }),
    Confirm: i18next.t('confirm', { lng: language }),
    Confirming: i18next.t('createAccount.confirming', { lng: language }),
    Sending: i18next.t('resetPassword.sending', { lng: language }),
    Submit: i18next.t('resetPassword.submit', { lng: language }),
    Submitting: i18next.t('resetPassword.submitting', { lng: language }),
    Code: i18next.t('resetPassword.code', { lng: language }),
    'Sign In': i18next.t('login.signIn', { lng: language }), // Tab header
    'Sign in': i18next.t('login.signIn', { lng: language }), // Button label
    'Enter your Email': i18next.t('login.enterYourEmail', { lng: language }),
    'Enter your Password': i18next.t('login.enterYourPassword', { lng: language }),
    'Forgot your password?': i18next.t('login.forgotYourPassword', { lng: language }),
    'Enter your Name': i18next.t('createAccount.enterYourName', { lng: language }),
    'Please confirm your Password': i18next.t('createAccount.pleaseConfirmYourPassword', { lng: language }),
    'Create Account': i18next.t('createAccount.createAccount', { lng: language }),
    'Confirm Password': i18next.t('createAccount.confirmPassword', { lng: language }),
    'We Emailed You': i18next.t('createAccount.weEmailedYou', { lng: language }),
    'Your code is on the way. To log in, enter the code we emailed to': i18next.t('createAccount.yourCodeIsOnTheWay', { lng: language }),
    'It may take a minute to arrive': i18next.t('createAccount.itMayTakeAMinuteToArrive', { lng: language }),
    'Confirmation Code': i18next.t('createAccount.confirmationCode', { lng: language }),
    'Resend Code': i18next.t('createAccount.resendCode', { lng: language }),
    'User does not exist.': i18next.t('login.userDoesNotExist', { lng: language }),
    'Enter your code': i18next.t('createAccount.enterYourCode', { lng: language }),
    'Reset Password': i18next.t('resetPassword.resetPassword', { lng: language }),
    'Enter your email': i18next.t('resetPassword.enterYourEmail', { lng: language }),
    'Send code': i18next.t('resetPassword.sendCode', { lng: language }),
    'Back to Sign In': i18next.t('resetPassword.backToSignIn', { lng: language }),
    'Code *': i18next.t('resetPassword.code', { lng: language }) + ' *',
    'New Password': i18next.t('resetPassword.newPassword', { lng: language }),
    'Your passwords must match': i18next.t('resetPassword.yourPasswordsMustMatch', { lng: language }),
    'User already exists': i18next.t('createAccount.userAlreadyExists', { lng: language }),
    'Creating Account': i18next.t('createAccount.creatingAccount', { lng: language }),
    [AuthErrorStrings.EMPTY_USERNAME]: i18next.t('nameCantBeEmpty', { lng: language }),
    [AuthErrorStrings.EMPTY_PASSWORD]: i18next.t('createAccount.passwordCantBeEmpty', { lng: language }),
    [AuthErrorStrings.EMPTY_CODE]: i18next.t('createAccount.confirmationCodeCantBeEmpty', { lng: language }),
  })
})
amplifyI18n.setLanguage(i18next.language)
/* eslint-enable */

export default i18next
