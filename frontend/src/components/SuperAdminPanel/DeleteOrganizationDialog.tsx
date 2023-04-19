import { FC } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import ErrorIcon from '@mui/icons-material/Error'

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
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        style: { borderRadius: 30 },
      }}
    >
      <DialogTitle>
        <ErrorIcon fontSize="large"></ErrorIcon>
        <span>
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
      <DialogActions>
        <Button onClick={() => onConfirm(organization)}>
          <span>{t('remove')}</span>
        </Button>
        <Button onClick={onCancel}>
          <span>{t('abort')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteOrganizationDialog
