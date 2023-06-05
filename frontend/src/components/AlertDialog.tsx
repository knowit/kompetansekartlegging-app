import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material'
import { AlertDialogProps } from '../types'
import ErrorIcon from '@mui/icons-material/Error'
import { useTranslation } from 'react-i18next'

export const AlertDialog = ({
  setAlertDialogOpen,
  alertDialogOpen,
  leaveFormButtonClicked,
}: AlertDialogProps) => {
  const { t } = useTranslation()

  const handleStayInForm = () => {
    setAlertDialogOpen(false)
  }

  const handleLeave = () => {
    if (leaveFormButtonClicked) leaveFormButtonClicked()
  }

  return (
    <Dialog
      open={alertDialogOpen}
      onClose={handleStayInForm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <ErrorIcon fontSize="large" />
        <div>{t('alertDialog.nbAnswersNotSaved')}</div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('alertDialog.leavingWillDiscardChanges')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLeave}>
          <div>{t('alertDialog.leaveForm')}</div>
        </Button>
        <Button autoFocus onClick={handleStayInForm}>
          <div>{t('alertDialog.stayOnForm')}</div>
        </Button>
      </DialogActions>
    </Dialog>
  )
}
