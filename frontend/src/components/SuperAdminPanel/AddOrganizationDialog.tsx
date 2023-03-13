import React, { useState } from 'react'

import Button from '@material-ui/core/Button'

import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'

import { dialogStyles } from '../../styles'
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
  const style = dialogStyles()
  const [organizationName, setOrganizationName] = useState('')
  const [organizationID, setOrganizationID] = useState('')
  const [organizationIdentifierAttribute, setOrganizationIdentifierAttribute] =
    useState('')

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
            {t('superAdmin.editOrganizations.addNewOrganization')}
          </span>
          <IconButton className={style.closeButton} onClick={onCancel}>
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
          className={style.textField}
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
          className={style.textField}
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
          className={style.textField}
          onChange={(e: any) =>
            setOrganizationIdentifierAttribute(e.target.value)
          }
        />
      </DialogTitle>
      <DialogActions className={style.alertButtons}>
        <Button onClick={onCancel} className={style.cancelButton}>
          <span className={style.buttonText}>{t('abort')}</span>
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
          className={style.confirmButton}
        >
          <span className={style.buttonText}>{t('add')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddOrganizationDialog
