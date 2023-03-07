import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { English } from './locales/en'
import { Norwegian } from './locales/no'
import { ReactComponent as NorwegianFlag } from './flags/Norway.svg'
import { ReactComponent as UnitedKingdomFlag } from './flags/UnitedKingdom.svg'

type languageType = {
  nativeName: string
  flag: React.FunctionComponent
}

export const availableLanguages: Record<string, languageType> = {
  en: { nativeName: 'ENGLISH', flag: UnitedKingdomFlag },
  no: { nativeName: 'NORSK', flag: NorwegianFlag },
}

i18next.use(initReactI18next).init({
  debug: true, // TODO: false
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

// Includes time
export const I18nDateToLocaleString = (date: Date) => {
  switch (i18next.language) {
    case 'no':
      return date.toLocaleString('nb-NO')
    default:
      return date.toLocaleString('en-GB')
  }
}

export default i18next
