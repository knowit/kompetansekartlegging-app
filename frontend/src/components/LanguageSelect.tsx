import { MenuItem, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { availableLanguages } from '../i18n/i18n'
import { I18n as amplifyI18n } from 'aws-amplify'
import LanguageIcon from '@mui/icons-material/Language'
import { KnowitColors } from '../styleconstants'
import styled from '@emotion/styled'

const StyledContainer = styled.div`
  .languageSelect {
    ${(props) => props.color && `border-color: ${props.color}`};
    height: min-content;
    box-shadow: none;
    > * {
      border: 0;
    }
  }
`

type LanguageSelectProps = {
  color?: string
}

export const LanguageSelect = ({ color }: LanguageSelectProps) => {
  const { i18n } = useTranslation()

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
    amplifyI18n.setLanguage(language)
    localStorage.setItem('language', language)
  }

  return (
    <StyledContainer>
      <Select
        className="languageSelect"
        value={i18n.language}
        onChange={(event) => changeLanguage(event.target.value as string)}
        renderValue={() => <LanguageIcon style={{ color: color }} />}
        aria-label={
          i18n.t('aria.selectLanguageLanguageIsSelected', {
            language: availableLanguages[i18n.language],
          }) as string
        }
      >
        {Object.keys(availableLanguages).map((language) => (
          <MenuItem
            key={language}
            value={language}
            style={
              i18n.language == language
                ? { backgroundColor: '#e4e0dc' }
                : { backgroundColor: 'transparent' }
            }
          >
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
    </StyledContainer>
  )
}
