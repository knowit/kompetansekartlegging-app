import React, { useState } from 'react'

import Button from '@mui/material/Button'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import { CloseIcon } from '../DescriptionTable'
import { OrganizationInfo } from './SuperAdminTypes'
import { useTranslation } from 'react-i18next'

interface AddOrganizationDialogProps {
  onCancel: () => void
  onConfirm: (arg: OrganizationInfo) => void
  open: boolean
}

const AddOrganizationDialog: React.FC<AddOrganizationDialogProps> = ({
  onCancel,
  onConfirm,
  open,
}) => {
  const { t } = useTranslation()

  const [organizationName, setOrganizationName] = useState('')
  const [organizationID, setOrganizationID] = useState('')
  const [organizationIdentifierAttribute, setOrganizationIdentifierAttribute] =
    useState('')

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
          <span>{t('superAdmin.editOrganizations.addNewOrganization')}</span>
          <IconButton onClick={onCancel} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          autoFocus
          fullWidth
          label={t('name')}
          variant="outlined"
          error={organizationName === ''}
          helperText={organizationName === '' && t('nameCantBeEmpty')}
          value={organizationName}
          onChange={(e: any) => setOrganizationName(e.target.value)}
        />
        <TextField
          autoFocus
          fullWidth
          label={t('superAdmin.editOrganizations.id')}
          variant="outlined"
          error={organizationID === ''}
          helperText={
            organizationID === '' &&
            t('superAdmin.editOrganizations.idCantBeEmpty')
          }
          value={organizationID}
          onChange={(e: any) => setOrganizationID(e.target.value)}
        />
        <TextField
          autoFocus
          fullWidth
          label={t('superAdmin.identifierAttribute')}
          variant="outlined"
          error={organizationIdentifierAttribute === ''}
          helperText={
            organizationIdentifierAttribute === '' &&
            t('superAdmin.editOrganizations.identifierAttributeCantBeEmpty')
          }
          value={organizationIdentifierAttribute}
          onChange={(e: any) =>
            setOrganizationIdentifierAttribute(e.target.value)
          }
        />
      </DialogTitle>
      <DialogActions>
        <Button onClick={onCancel}>
          <span>{t('abort')}</span>
        </Button>
        <Button
          disabled={organizationName === ''}
          onClick={() =>
            onConfirm({
              id: organizationID,
              name: organizationName,
              identifierAttribute: organizationIdentifierAttribute,
            })
          }
        >
          <span>{t('add')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddOrganizationDialog
