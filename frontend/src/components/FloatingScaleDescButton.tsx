import { Fab, Modal, Tooltip } from '@mui/material'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import DescriptionTable from './DescriptionTable'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'

const FabContainer = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
`

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

  const [showTooltip, setShowTooltip] = useState(isSmall)
  useEffect(() => {
    if (firstTimeLogin) {
      setTimeout(() => setShowTooltip(false), 5000)
    }
  }, [firstTimeLogin])

  const handleMobileFabClick = () => {
    setShowTooltip(false)
    setScaleDescOpen((scaleDescOpen) => !scaleDescOpen)
  }

  console.log(isSmall)

  return (
    <FabContainer>
      {scaleDescOpen && (
        <Modal
          open={scaleDescOpen}
          onClose={() => setScaleDescOpen((scaleDescOpen) => !scaleDescOpen)}
        >
          <div className="modalContent">
            <DescriptionTable
              onClose={() => setScaleDescOpen(false)}
              isSmall={isSmall}
            />
          </div>
        </Modal>
      )}
      <Tooltip title={'?'} open={showTooltip}>
        <Fab
          variant="extended"
          onClick={() => setScaleDescOpen((scaleDescOpen) => !scaleDescOpen)}
        >
          {isSmall ? '?' : t('scaleDescription')}
        </Fab>
      </Tooltip>
    </FabContainer>
  )
}

export default FloatingScaleDescButton
