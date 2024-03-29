import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import ErrorIcon from '@mui/icons-material/Error'

import { dialogStyles } from '../../../styles'
import { useTranslation } from 'react-i18next'

const ActivateCatalogDialog = ({
  onCancel,
  onConfirm,
  onExited,
  open,
}: any) => {
  const { t } = useTranslation()
  const style = dialogStyles()

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
          {t('admin.editCatalogs.activateCatalogQuestion')}
        </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('admin.editCatalogs.areYouSureYouWantToActivateThisCatalog')}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style.alertButtons}>
        <Button onClick={onConfirm} className={style.cancelButton}>
          <span className={style.buttonText}>
            {t('admin.editCatalogs.activate')}
          </span>
        </Button>
        <Button onClick={onCancel} className={style.confirmButton}>
          <span className={style.buttonText}>{t('abort')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ActivateCatalogDialog
