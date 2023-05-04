import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

import { useTranslation } from 'react-i18next'
import { dialogStyles } from '../../styles'
import { getAttribute } from './helpers'

type AnonymizeUserDialogProps = {
  onCancel: () => void
  onConfirm: () => void
  onExited: () => void
  user: any
  open: boolean
}

const AnonymizeUserDialog = ({
  onCancel,
  onConfirm,
  onExited,
  user,
  open,
}: AnonymizeUserDialogProps) => {
  const { t } = useTranslation()
  const style = dialogStyles()
  const name = getAttribute(user, 'name')

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        style: { borderRadius: 30 },
      }}
      TransitionProps={{
        onExited,
      }}
    >
      <DialogTitle className={style.dialogTitle}>
        <ErrorIcon fontSize="large" className={style.errorIcon} />
        <span className={style.dialogTitleText}>
          {t('admin.anonymizeUsers.anonymizeNameQuestion', { name: name })}
        </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('admin.anonymizeUsers.areYouSureYouWantToAnonymizeName', {
            name: name,
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style.alertButtons}>
        <Button onClick={onConfirm} className={style.cancelButton}>
          <span className={style.buttonText}>
            {t('admin.anonymizeUsers.anonymize')}
          </span>
        </Button>
        <Button onClick={onCancel} className={style.confirmButton}>
          <span className={style.buttonText}>{t('abort')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AnonymizeUserDialog
