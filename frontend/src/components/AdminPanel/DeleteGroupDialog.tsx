import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ErrorIcon from '@material-ui/icons/Error'

import { useTranslation } from 'react-i18next'
import { dialogStyles } from '../../styles'

const DeleteGroupDialog = ({ onCancel, onConfirm, open }: any) => {
  const { t } = useTranslation()
  const style = dialogStyles()

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        style: { borderRadius: 30 },
      }}
    >
      <DialogTitle className={style.dialogTitle}>
        <ErrorIcon fontSize="large" className={style.errorIcon} />
        <span className={style.dialogTitleText}>
          {t('admin.editGroups.removeGroupQuestion')}
        </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('admin.editGroups.areYouSureYouWantToRemoveTheGroup')}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style.alertButtons}>
        <Button onClick={onConfirm} className={style.cancelButton}>
          {t('remove').toUpperCase()}
        </Button>
        <Button onClick={onCancel} className={style.confirmButton}>
          {t('abort').toUpperCase()}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteGroupDialog
