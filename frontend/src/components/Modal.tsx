import { Modal as CoreModal, IconButton } from '@mui/material'
import styled from '@emotion/styled'
import { Close as CloseIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { KnowitColors } from '../styleconstants'

type StylingProps = {
  isSmall: boolean
}

export const ModalWrapper = styled.div`
  ${(props: StylingProps) => props.isSmall && 'min-width: 100vw;'}
  ${(props: StylingProps) => props.isSmall && 'min-height: 100vh;'}
  ${(props: StylingProps) => !props.isSmall && 'max-width: 500px;'}
  ${(props: StylingProps) => !props.isSmall && 'max-height: 80vh;'}

  padding: 20px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  background-color: ${KnowitColors.lightGreen};
  border: 2px solid #000;

  max-height: 100vw;
  overflow-y: auto;
  word-wrap: break-word;

  font-size: 0.9em;

  h1 {
    font-size: 1.5em;
  }
  h2 {
    font-size: 1.2em;
  }
  h3 {
    font-size: 1em;
  }

  .closeButton {
    width: 100%;
    display: ${(props: StylingProps) => (props.isSmall ? 'flex' : 'none')};
    justify-content: right;
  }
`

type ModalProps = {
  isSmall: boolean
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  children: any
}

const Modal = ({ isSmall, isOpen, setIsOpen, children }: ModalProps) => {
  const { t } = useTranslation()

  return (
    <CoreModal open={isOpen} onClose={() => setIsOpen(false)}>
      <ModalWrapper isSmall={isSmall}>
        <div className="closeButton">
          <IconButton
            aria-label={t('close') as string}
            onClick={() => setIsOpen(false)}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </div>
        {children}
      </ModalWrapper>
    </CoreModal>
  )
}

export default Modal
