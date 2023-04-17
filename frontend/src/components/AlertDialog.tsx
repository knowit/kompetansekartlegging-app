import React from 'react'
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
import { dialogStyles } from '../styles'
import { useTranslation } from 'react-i18next'

export const AlertDialog = ({ ...props }: AlertDialogProps) => {
  const { t } = useTranslation()
  const style = dialogStyles()

  const handleStayInForm = () => {
    props.setAlertDialogOpen(false)
  }

  const handleLeave = () => {
    if (props.leaveFormButtonClicked) props.leaveFormButtonClicked()
  }

  return (
    <Dialog
      open={props.alertDialogOpen}
      onClose={handleStayInForm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: { borderRadius: 30 },
      }}
    >
      <DialogTitle id="alert-dialog-title" className={style.dialogTitle}>
        <ErrorIcon fontSize="large" className={style.errorIcon} />
        <div className={style.dialogTitleText}>
          {t('alertDialog.nbAnswersNotSaved')}
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          className={style.alertText}
        >
          {t('alertDialog.leavingWillDiscardChanges')}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style.alertButtons}>
        <Button onClick={handleLeave} className={style.cancelButton}>
          <div className={style.buttonText}>{t('alertDialog.leaveForm')}</div>
        </Button>
        <Button
          autoFocus
          onClick={handleStayInForm}
          className={style.confirmButton}
        >
          <div className={style.buttonText}>{t('alertDialog.stayOnForm')}</div>
        </Button>
      </DialogActions>
    </Dialog>
  )
}
