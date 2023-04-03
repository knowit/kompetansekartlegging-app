import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import ErrorIcon from '@mui/icons-material/Error'
import { useTranslation } from 'react-i18next'

const ActivateCatalogDialog = ({
  onCancel,
  onConfirm,
  onExited,
  open,
}: any) => {
  const { t } = useTranslation()

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
        <span>{t('admin.editCatalogs.activateCatalogQuestion')}</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('admin.editCatalogs.areYouSureYouWantToActivateThisCatalog')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>
          <span>{t('admin.editCatalogs.activate')}</span>
        </Button>
        <Button onClick={onCancel}>
          <span>{t('abort')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ActivateCatalogDialog
