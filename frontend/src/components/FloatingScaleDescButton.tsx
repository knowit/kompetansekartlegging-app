import { Fab, Modal, Tooltip } from '@mui/material'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { KnowitColors } from '../styles'
import DescriptionTable from './DescriptionTable'
import { useTranslation } from 'react-i18next'

type FloatingScaleDescButtonProps = {
  isMobile: boolean
  scaleDescOpen: boolean
  setScaleDescOpen: Dispatch<SetStateAction<boolean>>
  firstTimeLogin: boolean
}

type ConditionalWrapProps = {
  condition: boolean
  wrap: (children: JSX.Element) => JSX.Element
  children: JSX.Element
}

const ConditionalWrap = ({ condition, wrap, children }: ConditionalWrapProps) =>
  condition ? wrap(children) : children

const FloatingScaleDescButton = ({
  isMobile,
  scaleDescOpen,
  setScaleDescOpen,
  firstTimeLogin,
}: FloatingScaleDescButtonProps) => {
  const { t } = useTranslation()

  const [showTooltip, setShowTooltip] = useState(firstTimeLogin)
  useEffect(() => {
    if (firstTimeLogin) {
      setTimeout(() => setShowTooltip(false), 5000)
    }
  }, [firstTimeLogin])

  const handleMobileFabClick = () => {
    setShowTooltip(false)
    setScaleDescOpen((scaleDescOpen) => !scaleDescOpen)
  }

  return (
    <>
      {scaleDescOpen && (
        <Modal
          open={scaleDescOpen}
          onClose={() => setScaleDescOpen((scaleDescOpen) => !scaleDescOpen)}
        >
          <div>
            <DescriptionTable
              onClose={() => setScaleDescOpen(false)}
              isMobile={isMobile}
            />
            <div></div>
          </div>
        </Modal>
      )}
      {isMobile ? (
        <ConditionalWrap
          condition={firstTimeLogin}
          wrap={(children) => (
            <Tooltip
              title={t('pressHereToSeeWhatTheIconsMean') as string}
              open={showTooltip}
              arrow
            >
              {children}
            </Tooltip>
          )}
        >
          <Fab size="medium" variant="circular" onClick={handleMobileFabClick}>
            ?
          </Fab>
        </ConditionalWrap>
      ) : (
        <Fab
          variant="extended"
          onClick={() => setScaleDescOpen((scaleDescOpen) => !scaleDescOpen)}
        >
          {t('scaleDescription').toUpperCase()}
        </Fab>
      )}
    </>
  )
}

export default FloatingScaleDescButton
