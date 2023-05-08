import { useState } from 'react'

import Button from '@mui/material/Button'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'

const AddCatalogDialog = ({ onCancel, onConfirm, open }: any) => {
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
    >
      <DialogTitle>
        <Box
          component="div"
          mb={1}
          display="flex"
          justifyContent="space-between"
        >
          <span>{t('admin.editCatalogs.createNewCatalog')}</span>
          <IconButton onClick={onCancel} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          autoFocus
          fullWidth
          label={t('admin.editCatalogs.nameOfNewCatalog')}
          error={name === ''}
          helperText={name === '' && t('nameCantBeEmpty')}
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />
      </DialogTitle>
      <DialogActions>
        <Button onClick={onCancel}>
          <span>{t('abort')}</span>
        </Button>
        <Button disabled={name === ''} onClick={() => onConfirm(name)}>
          <span>{t('add')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCatalogDialog
