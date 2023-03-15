import { MenuItem, Select } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { availableLanguages } from '../i18n/i18n'
import { I18n as amplifyI18n } from 'aws-amplify'
import LanguageIcon from '@material-ui/icons/Language'
import { KnowitColors } from '../styles'

type LanguageSelectProps = {
  isMobile: boolean
  iconColor: string
  marginLeft?: number
}

export const LanguageSelect = (props: LanguageSelectProps) => {
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
      renderValue={() => <LanguageIcon style={{ color: props.iconColor }} />}
      style={props.isMobile ? { marginLeft: props.marginLeft } : undefined}
      aria-label={
        i18n.t('aria.selectLanguageLanguageIsSelected', {
          language: availableLanguages[i18n.language],
        }) as string
      }
    >
      {Object.keys(availableLanguages).map((language) => (
        <MenuItem key={language} value={language}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: KnowitColors.darkBrown,
            }}
          >
            {availableLanguages[language]}
          </div>
        </MenuItem>
      ))}
    </Select>
  )
}
