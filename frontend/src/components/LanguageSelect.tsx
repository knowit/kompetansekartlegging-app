import { MenuItem, Select } from '@mui/material'

import { useTranslation } from 'react-i18next'
import { availableLanguages } from '../i18n/i18n'
import { I18n as amplifyI18n } from 'aws-amplify'
import LanguageIcon from '@mui/icons-material/Language'

export const LanguageSelect = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
    amplifyI18n.setLanguage(language)
    localStorage.setItem('language', language)
  }

  return (
    <Select
      value={i18n.language}
      onChange={(event) => changeLanguage(event.target.value as string)}
      aria-label={
        i18n.t('aria.selectLanguageLanguageIsSelected', {
          language: availableLanguages[i18n.language],
        }) as string
      }
    >
      {Object.keys(availableLanguages).map((language) => (
        <MenuItem key={language} value={language}>
          {availableLanguages[language]}
        </MenuItem>
      ))}
    </Select>
  )
}
