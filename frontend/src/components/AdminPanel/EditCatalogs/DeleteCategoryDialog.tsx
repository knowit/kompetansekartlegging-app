import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import ErrorIcon from '@mui/icons-material/Error'

import { useTranslation } from 'react-i18next'
import { dialogStyles } from '../../../styles'

const DeleteCategoryDialog = ({
  category,
  categoryContainsQuestions,
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
        <ErrorIcon fontSize="large" className={style.errorIcon}></ErrorIcon>
        <span className={style.dialogTitleText}>
          {t('admin.editCatalogs.removeTheCategoryQuestion', {
            categoryName: category.text,
          })}
        </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {!categoryContainsQuestions
            ? t('admin.editCatalogs.areYouSureYouWantToRemoveThisCategory')
            : t(
                'admin.editCatalogs.cantRemoveCategoryAsItStillContainsQuestions'
              )}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style.alertButtons}>
        <Button
          onClick={onConfirm}
          className={style.cancelButton}
          disabled={categoryContainsQuestions}
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

export default DeleteCategoryDialog
