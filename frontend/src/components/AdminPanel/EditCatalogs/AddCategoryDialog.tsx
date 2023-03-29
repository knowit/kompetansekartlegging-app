import { useState } from 'react'

import Button from '@mui/material/Button'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import { dialogStyles } from '../../../styles'
import { CloseIcon } from '../../DescriptionTable'
import { useTranslation } from 'react-i18next'

const AddCategoryDialog = ({ onCancel, onConfirm, open }: any) => {
  const { t } = useTranslation()
  const style = dialogStyles()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: { borderRadius: 30 },
      }}
    >
      <DialogTitle>
        <Box
          component="div"
          mb={1}
          display="flex"
          justifyContent="space-between"
        >
          <span className={style.dialogTitleText}>
            {t('admin.editCatalogs.addNewCategory')}
          </span>
          <IconButton className={style.closeButton} onClick={onCancel} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          label={t('admin.editCatalogs.nameOfNewCategory')}
          variant="outlined"
          error={name === ''}
          helperText={name === '' && t('nameCantBeEmpty')}
          value={name}
          className={style.textField}
          onChange={(e: any) => setName(e.target.value)}
        />
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={6}
          label={t('description')}
          variant="outlined"
          value={description}
          className={style.textField}
          onChange={(e: any) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions className={style.alertButtons}>
        <Button onClick={onCancel} className={style.cancelButton}>
          <span className={style.buttonText}>{t('abort')}</span>
        </Button>
        <Button
          disabled={name === ''}
          onClick={() => onConfirm(name, description)}
          className={style.confirmButton}
        >
          <span className={style.buttonText}>{t('add')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddCategoryDialog
