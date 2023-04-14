import React, { useState } from 'react'

import Button from '@mui/material/Button'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import CloseIcon from '@mui/icons-material/Close'
import { OrganizationInfo } from './SuperAdminTypes'
import { useTranslation } from 'react-i18next'
import { CircularProgress } from '@mui/material'

interface AddOrganizationDialogProps {
  onCancel: () => void
  onConfirm: (organization: OrganizationInfo, adminEmail: string) => void
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
  const [organizationAdminEmail, setOrganizationAdminEmail] = useState('')
  const [isAddingOrganization, setIsAddingOrganization] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+$/
  const isOrganizationAdminEmailValid =
    organizationAdminEmail.length === 0 ||
    emailRegex.test(organizationAdminEmail)

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
          required
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
          required
          fullWidth
          label={t('superAdmin.editOrganizations.id')}
          variant="outlined"
          error={organizationID === '' || organizationID.includes('0')}
          helperText={
            (organizationID === '' || organizationID.includes('0')) &&
            t('superAdmin.editOrganizations.idCantBeEmptyOrContainZero')
          }
          value={organizationID}
          onChange={(e: any) => setOrganizationID(e.target.value)}
        />
        <TextField
          required
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
        <TextField
          fullWidth
          label={t('superAdmin.editOrganizations.adminEmail')}
          variant="outlined"
          error={!isOrganizationAdminEmailValid}
          helperText={
            !isOrganizationAdminEmailValid &&
            t('superAdmin.editOrganizations.adminEmailIsInvalid')
          }
          value={organizationAdminEmail}
          onChange={(e: any) => setOrganizationAdminEmail(e.target.value)}
        />
      </DialogTitle>
      {isAddingOrganization ? (
        <div style={{ height: 65, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </div>
      ) : (
        <DialogActions>
          <Button onClick={onCancel}>
            <span>{t('abort')}</span>
          </Button>
          <Button
            disabled={
              organizationName === '' ||
              organizationID === '' ||
              organizationID.includes('0') ||
              organizationIdentifierAttribute === '' ||
              !isOrganizationAdminEmailValid
            }
            onClick={() => {
              setIsAddingOrganization(true)
              onConfirm(
                {
                  id: organizationID,
                  name: organizationName,
                  identifierAttribute: organizationIdentifierAttribute,
                },
                organizationAdminEmail
              )
            }}
          >
            <span>{t('add')}</span>
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default AddOrganizationDialog
