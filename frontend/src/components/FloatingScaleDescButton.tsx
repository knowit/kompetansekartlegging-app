import { Fab, Tooltip } from '@mui/material'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import React from 'react'
import * as Icon from '../icons/iconController'
import i18n from '../i18n/i18n'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { TipsAndUpdates } from '@mui/icons-material'
import Modal from './Modal'

const FabContainer = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
`

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

const StyledDescriptiontable = styled.div`
  .scaleItem {
    margin-bottom: 1vh;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .scaleIcon {
    min-width: 25px;
    margin-right: 10px;
  }
`

const DescriptionTable = () => {
  const { t } = useTranslation()

  const ScaleContainer = ({ icon, heading, text }: ScaleContainerProps) => (
    <div className="scaleItem">
      <div className="scaleIcon">{icon}</div>
      <div>
        <h3>{heading}</h3>
        <div>{text}</div>
      </div>
    </div>
  )

  return (
    <StyledDescriptiontable>
      <h1>{t('scaleDescription')}</h1>
      <div>
        <section>
          <header>
            <h2>{t('competenceScale.competenceScale')}</h2>
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
        </section>

        <section>
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
        </section>
      </div>
    </StyledDescriptiontable>
  )
}

type FloatingScaleDescButtonProps = {
  isSmall: boolean
  scaleDescOpen: boolean
  setScaleDescOpen: Dispatch<SetStateAction<boolean>>
  firstTimeLogin: boolean
}

const FloatingScaleDescButton = ({
  isSmall,
  scaleDescOpen,
  setScaleDescOpen,
  firstTimeLogin,
}: FloatingScaleDescButtonProps) => {
  const { t } = useTranslation()

  const [showTooltip, setShowTooltip] = useState(true)

  useEffect(() => {
    if (firstTimeLogin) {
      setTimeout(() => setShowTooltip(false), 5000)
    }
  }, [firstTimeLogin])

  return (
    <FabContainer>
      {scaleDescOpen && (
        <Modal
          isSmall={isSmall}
          isOpen={scaleDescOpen}
          setIsOpen={setScaleDescOpen}
        >
          <DescriptionTable />
        </Modal>
      )}
      <Tooltip title={t('scaleDescription')} open={showTooltip} arrow>
        <Fab
          variant="extended"
          onClick={() => {
            setScaleDescOpen((scaleDescOpen) => !scaleDescOpen)
            setShowTooltip(false)
          }}
        >
          <TipsAndUpdates />
        </Fab>
      </Tooltip>
    </FabContainer>
  )
}

export default FloatingScaleDescButton
