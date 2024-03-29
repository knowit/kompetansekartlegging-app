import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import ErrorIcon from '@mui/icons-material/Error'

import { dialogStyles } from '../../styles'
import { getAttribute } from './helpers'
import { useTranslation } from 'react-i18next'
import { ORGANIZATION_ID_ATTRIBUTE } from '../../constants'

const DeleteUserFromGroupDialog = ({
  onCancel,
  onConfirm,
  onExited,
  user,
  open,
  roleName,
  disableRoleSuffix,
  children,
  showOrgId,
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
          {t('admin.removeNameFromRole', { name: name, role: role })}
        </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {showOrgId === true
            ? t(
                'superAdmin.areYouSureYouWantToRemoveNameFromRoleAtOrganization',
                {
                  name: name,
                  role: role,
                  organization: getAttribute(user, ORGANIZATION_ID_ATTRIBUTE),
                }
              ) + ' '
            : t('admin.areYouSureYouWantToRemoveNameFromRole', {
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
