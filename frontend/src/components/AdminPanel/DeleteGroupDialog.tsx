import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import ErrorIcon from '@mui/icons-material/Error'

import { useTranslation } from 'react-i18next'

const DeleteGroupDialog = ({ onCancel, onConfirm, open }: any) => {
  const { t } = useTranslation()

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        style: { borderRadius: 30 },
      }}
    >
      <DialogTitle>
        <ErrorIcon fontSize="large" />
        <span>{t('admin.editGroups.removeGroupQuestion')}</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('admin.editGroups.areYouSureYouWantToRemoveTheGroup')}
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

export default DeleteGroupDialog
