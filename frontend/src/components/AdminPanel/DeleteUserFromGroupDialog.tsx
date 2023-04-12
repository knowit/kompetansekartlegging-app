import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ErrorIcon from '@material-ui/icons/Error'

import { useTranslation } from 'react-i18next'
import { dialogStyles } from '../../styles'
import { getAttribute } from './helpers'

const DeleteUserFromGroupDialog = ({
  onCancel,
  onConfirm,
  onExited,
  user,
  open,
  roleName,
  disableRoleSuffix,
  children,
}: any) => {
  const { t } = useTranslation()
  const style = dialogStyles()
  const name = getAttribute(user, 'name')
  const role = disableRoleSuffix
    ? roleName
    : `${roleName + t('roleDefiniteForm')}`

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      onExited={onExited}
      PaperProps={{
        style: { borderRadius: 30 },
      }}
    >
      <DialogTitle className={style.dialogTitle}>
        <ErrorIcon fontSize="large" className={style.errorIcon} />
        <span className={style.dialogTitleText}>
          {t('admin.removeNameFromRole', { name: name, role: role })}
        </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('admin.areYouSureYouWantToDeleteNameFromRole', {
            name: name,
            role: role,
          }) + ' '}
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style.alertButtons}>
        <Button onClick={onConfirm} className={style.cancelButton}>
          <span className={style.buttonText}>{t('remove')}</span>
        </Button>
        <Button onClick={onCancel} className={style.confirmButton}>
          <span className={style.buttonText}>{t('abort')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteUserFromGroupDialog
