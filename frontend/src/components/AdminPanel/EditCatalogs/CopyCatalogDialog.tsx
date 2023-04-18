import { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'

const CopyCatalogDialog = ({ onCancel, onConfirm, onExited, open }: any) => {
  const { t } = useTranslation()
  const [name, setName] = useState('')

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
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
          <span>{t('admin.editCatalogs.copyCatalog')}</span>
          <IconButton onClick={onCancel} size="large">
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
          onChange={(e: any) => setName(e.target.value)}
        />
      </DialogTitle>
      <DialogActions>
        <Button disabled={name === ''} onClick={() => onConfirm(name)}>
          <span>{t('admin.editCatalogs.copy')}</span>
        </Button>
        <Button onClick={onCancel}>
          <span>{t('abort')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CopyCatalogDialog
