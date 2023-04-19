import { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

import { dialogStyles } from '../../../styles'
import { CloseIcon } from '../../DescriptionTable'
import { useTranslation } from 'react-i18next'

const CopyCatalogDialog = ({ onCancel, onConfirm, onExited, open }: any) => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const style = dialogStyles()

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: { borderRadius: 30 },
      }}
      TransitionProps={{
        onExited,
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
            {t('admin.editCatalogs.copyCatalog')}
          </span>
          <IconButton
            className={style.closeButton}
            onClick={onCancel}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          autoFocus
          fullWidth
          label={t('admin.editCatalogs.nameOfNewCatalog')}
          variant="outlined"
          error={name === ''}
          helperText={name === '' && t('nameCantBeEmpty')}
          value={name}
          className={style.textField}
          onChange={(e: any) => setName(e.target.value)}
        />
      </DialogTitle>
      <DialogActions className={style.alertButtons}>
        <Button
          disabled={name === ''}
          onClick={() => onConfirm(name)}
          className={style.confirmButton}
        >
          <span className={style.buttonText}>
            {t('admin.editCatalogs.copy')}
          </span>
        </Button>
        <Button onClick={onCancel} className={style.cancelButton}>
          <span className={style.buttonText}>{t('abort')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CopyCatalogDialog
