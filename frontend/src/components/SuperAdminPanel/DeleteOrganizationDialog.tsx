import { FC } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import ErrorIcon from '@mui/icons-material/Error'

import { dialogStyles } from '../../styles'
import { OrganizationInfo } from './SuperAdminTypes'
import { t } from 'i18next'

interface DeleteOrganiationDialogProps {
  open: boolean
  onConfirm: (arg: OrganizationInfo) => void
  onCancel: () => void
  organization: OrganizationInfo
}

const DeleteOrganizationDialog: FC<DeleteOrganiationDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  organization,
}) => {
  const style = dialogStyles()

  return (
    <Dialog
      open={open}
      PaperProps={{
        style: { borderRadius: 30 },
      }}
    >
      <DialogTitle className={style.dialogTitle}>
        <ErrorIcon fontSize="large" className={style.errorIcon}></ErrorIcon>
        <span className={style.dialogTitleText}>
          {t('superAdmin.editOrganizations.removeOrganization', {
            organization: organization.name,
          })}
        </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t(
            'superAdmin.editOrganizations.areYouSureYouWantToRemoveTheOrganization',
            { organization: organization.name }
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style.alertButtons}>
        <Button
          onClick={() => onConfirm(organization)}
          className={style.cancelButton}
        >
          <span className={style.buttonText}>{t('remove')}</span>
        </Button>
        <Button onClick={onCancel} className={style.confirmButton}>
          <span className={style.buttonText}>{t('abort')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteOrganizationDialog
