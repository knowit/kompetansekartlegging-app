import React from 'react'
import * as Icon from '../icons/iconController'
import IconButton from '@mui/material/IconButton'
import i18n from '../i18n/i18n'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'

type ScaleContainerProps = {
  icon: JSX.Element
  heading: string
  text: string
}

type ScaleContainerObject = {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  heading: string
  text: string
}

// Possibly a better way to do this...
// Function > variable to support i18n language change
const getCompetence = (): ScaleContainerObject[] => [
  {
    icon: Icon.K5,
    heading: i18n.t('competenceScale.superstar'),
    text: i18n.t('competenceScale.description.superstar'),
  },
  {
    icon: Icon.K4,
    heading: i18n.t('competenceScale.expert'),
    text: i18n.t('competenceScale.description.expert'),
  },
  {
    icon: Icon.K3,
    heading: i18n.t('competenceScale.professional'),
    text: i18n.t('competenceScale.description.professional'),
  },
  {
    icon: Icon.K2,
    heading: i18n.t('competenceScale.potentiallyUsable'),
    text: i18n.t('competenceScale.description.potentiallyUsable'),
  },

  {
    icon: Icon.K1,
    heading: i18n.t('competenceScale.someInsight'),
    text: i18n.t('competenceScale.description.someInsight'),
  },
  {
    icon: Icon.K0,
    heading: i18n.t('competenceScale.unfamiliar'),
    text: '',
  },
]

const getMotivation = (): ScaleContainerObject[] => [
  {
    icon: Icon.M5,
    heading: i18n.t('motivationScale.enthusiast'),
    text: '',
  },
  {
    icon: Icon.M4,
    heading: i18n.t('motivationScale.good'),
    text: '',
  },
  {
    icon: Icon.M3,
    heading: i18n.t('motivationScale.curious'),
    text: '',
  },
  {
    icon: Icon.M2,
    heading: i18n.t('motivationScale.ish'),
    text: '',
  },
  {
    icon: Icon.M1,
    heading: i18n.t('motivationScale.neutral'),
    text: '',
  },
  {
    icon: Icon.M0,
    heading: i18n.t('motivationScale.no'),
    text: '',
  },
]

type DescriptionTableProps = {
  onClose: React.MouseEventHandler<HTMLButtonElement>
  isSmall: boolean
}

export const DescriptionTable = ({
  onClose,
  isSmall,
}: DescriptionTableProps) => {
  const { t } = useTranslation()

  const ScaleContainer = ({ ...props }: ScaleContainerProps) => (
    <div>
      <div>{props.icon}</div>
      <div>
        <h3>{props.heading}</h3>
        <div>{props.text}</div>
      </div>
    </div>
  )

  return (
    <div>
      {isSmall && (
        <div>
          <header>
            <h1>{t('scaleDescription')}</h1>
            <IconButton
              aria-label={t('close') as string}
              onClick={onClose}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </header>
        </div>
      )}

      <div>
        <div>
          <header>
            <h2>{t('competenceScale.competenceScale')}</h2>
            {!isSmall && (
              <IconButton
                aria-label={t('close') as string}
                onClick={onClose}
                size="large"
              >
                <CloseIcon />
              </IconButton>
            )}
          </header>
          {getCompetence().map((obj, i) => {
            const Icon = obj.icon
            return (
              <ScaleContainer
                key={`competence-${i}`}
                icon={<Icon />}
                heading={obj.heading}
                text={obj.text}
              />
            )
          })}
        </div>

        <div>
          <header>
            <h2>{i18n.t('motivationScale.motivationScale')}</h2>
          </header>
          {getMotivation().map((obj, i) => {
            const Icon = obj.icon
            return (
              <ScaleContainer
                key={`motivation-${i}`}
                icon={<Icon />}
                heading={obj.heading}
                text={obj.text}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DescriptionTable
