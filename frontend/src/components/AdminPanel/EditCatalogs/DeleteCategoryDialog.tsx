import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import ErrorIcon from '@mui/icons-material/Error'

import { useTranslation } from 'react-i18next'

const DeleteCategoryDialog = ({
  category,
  categoryContainsQuestions,
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
        <ErrorIcon fontSize="large"></ErrorIcon>
        <span>
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
      <DialogActions>
        <Button onClick={onConfirm} disabled={categoryContainsQuestions}>
          <span>{t('remove')}</span>
        </Button>
        <Button onClick={onCancel}>
          <span>{t('abort')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteCategoryDialog
