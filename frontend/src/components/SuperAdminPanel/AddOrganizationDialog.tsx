import { FC, useState } from 'react'

import Button from '@mui/material/Button'

import Box from '@mui/material/Box'
import { CircularProgress, Tooltip } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import HelpIcon from '@mui/icons-material/Help'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import { dialogStyles, KnowitColors } from '../../styles'
import { CloseIcon } from '../DescriptionTable'
import { OrganizationInfo } from './SuperAdminTypes'
import { useTranslation } from 'react-i18next'
import { getUserExists } from '../AdminPanel/adminApi'

interface AddOrganizationDialogProps {
  onCancel: () => void
  onConfirm: (organization: OrganizationInfo, adminEmail: string) => void
  open: boolean
}

const AddOrganizationDialog: FC<AddOrganizationDialogProps> = ({
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
  const [organizationAdminEmail, setOrganizationAdminEmail] = useState('')
  const [emailAlreadyExists, setEmailAlreadyExists] = useState<boolean>(false)
  const [isAddingOrganization, setIsAddingOrganization] = useState(false)
  const [emailExistsValidationError, setEmailExistsValidationError] =
    useState<boolean>(false)

  const emailRegex = /^[^\s@]+@[^\s@]+$/
  const isOrganizationAdminEmailValid =
    organizationAdminEmail.length === 0 ||
    emailRegex.test(organizationAdminEmail)

  const addOrganization = () => {
    onConfirm(
      {
        id: organizationID,
        name: organizationName,
        identifierAttribute: organizationIdentifierAttribute,
      },
      organizationAdminEmail
    )
  }

  const addOrganizationIfEmailDoesNotExist = async () => {
    setIsAddingOrganization(true)
    setEmailExistsValidationError(false)

    try {
      const res = await getUserExists(organizationAdminEmail)

      if (!res.userExists) {
        addOrganization()
      } else {
        setEmailAlreadyExists(true)
        setIsAddingOrganization(false)
      }
    } catch (e) {
      setEmailExistsValidationError(true)
      setIsAddingOrganization(false)
    }
  }

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
          <IconButton
            className={style.closeButton}
            onClick={onCancel}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 30px',
            gridTemplateAreas: `
                                'textfield1 .'
                                'textfield2 .'
                                'textfield3 .'
                                'textfield4 tooltip4'
                              `,
          }}
        >
          <TextField
            required
            autoFocus
            fullWidth
            label={t('name')}
            variant="outlined"
            error={organizationName === ''}
            helperText={organizationName === '' && t('nameCantBeEmpty')}
            value={organizationName}
            className={style.textField}
            style={{ gridArea: 'textfield1' }}
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
            className={style.textField}
            style={{ gridArea: 'textfield2' }}
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
            className={style.textField}
            style={{ gridArea: 'textfield3' }}
            onChange={(e: any) =>
              setOrganizationIdentifierAttribute(e.target.value)
            }
          />
          <TextField
            fullWidth
            label={t('superAdmin.editOrganizations.adminEmail')}
            variant="outlined"
            error={!isOrganizationAdminEmailValid || emailAlreadyExists}
            helperText={
              (!isOrganizationAdminEmailValid &&
                t('superAdmin.editOrganizations.adminEmailIsInvalid')) ||
              (emailAlreadyExists &&
                t(
                  'superAdmin.editOrganizations.thereAlreadyExistsAUserWithTheEmail',
                  { email: organizationAdminEmail }
                ))
            }
            value={organizationAdminEmail}
            className={style.textField}
            style={{ gridArea: 'textfield4' }}
            onChange={(e: any) => {
              setOrganizationAdminEmail(e.target.value)
              setEmailAlreadyExists(false)
              setEmailExistsValidationError(false)
            }}
          />
          <Tooltip
            arrow
            title={
              <div style={{ fontSize: '1.2em', whiteSpace: 'pre-line' }}>
                {t('superAdmin.editOrganizations.adminEmailTooltip')}
              </div>
            }
            style={{
              gridArea: 'tooltip4',
              placeSelf: 'center',
              marginLeft: '10px',
              marginBottom: isOrganizationAdminEmailValid ? '8px' : '30px',
            }}
          >
            <HelpIcon htmlColor={KnowitColors.darkBrown} fontSize={'medium'} />
          </Tooltip>
        </div>
      </DialogTitle>
      {emailExistsValidationError && (
        <p style={{ textAlign: 'center' }}>
          {t('errorOccured') +
            t(
              'superAdmin.editOrganizations.couldNotValidateIfAUserWithTheEmailAlreadyExists'
            )}
        </p>
      )}
      {isAddingOrganization ? (
        <div style={{ height: 65, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </div>
      ) : (
        <DialogActions className={style.alertButtons}>
          <Button onClick={onCancel} className={style.cancelButton}>
            <span className={style.buttonText}>{t('abort')}</span>
          </Button>
          <Button
            disabled={
              organizationName === '' ||
              organizationID === '' ||
              organizationID.includes('0') ||
              organizationIdentifierAttribute === '' ||
              !isOrganizationAdminEmailValid
            }
            onClick={
              organizationAdminEmail == ''
                ? addOrganization
                : addOrganizationIfEmailDoesNotExist
            }
            className={style.confirmButton}
          >
            <span className={style.buttonText}>{t('add')}</span>
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default AddOrganizationDialog
