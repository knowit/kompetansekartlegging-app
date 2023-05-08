import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import ErrorIcon from '@mui/icons-material/Error'

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
      <DialogTitle>
        <ErrorIcon fontSize="large" />
        <span>{t('admin.removeNameFromRole', { name: name, role: role })}</span>
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
      <DialogActions>
        <Button onClick={onConfirm}>
          <span>{t('remove')}</span>
        </Button>
        <Button onClick={onCancel}>
          <span>{t('abort')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteUserFromGroupDialog
