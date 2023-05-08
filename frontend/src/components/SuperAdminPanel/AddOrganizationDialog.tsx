import { FC, useState } from 'react'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Tooltip } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import HelpIcon from '@mui/icons-material/Help'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { OrganizationInfo } from './SuperAdminTypes'
import { useTranslation } from 'react-i18next'
import CenteredCircularProgress from '../CenteredCircularProgress'
import { KnowitColors } from '../../styleconstants'
import { getUserExists } from '../AdminPanel/adminApi'
import styled from '@emotion/styled'

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: auto 30px;
  grid-template-areas:
    'textfield1 .'
    'textfield2 .'
    'textfield3 .'
    'textfield4 tooltip4';

  .textfield1 {
    grid-area: textfield1;
  }

  .textfield2 {
    grid-area: textfield2;
  }

  .textfield3 {
    grid-area: textfield3;
  }

  .textfield4 {
    grid-area: textfield4;
  }

  .tooltip4 {
    grid-area: tooltip4;
    place-self: center;
    margin-left: 10px;
  }
`

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
        <StyledContainer>
          <TextField
            required
            autoFocus
            fullWidth
            label={t('name')}
            variant="outlined"
            error={organizationName === ''}
            helperText={organizationName === '' && t('nameCantBeEmpty')}
            value={organizationName}
            className="textfield1"
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
            className="textfield2"
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
            className="textfield3"
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
            className="textfield4"
            onChange={(e: any) => {
              setOrganizationAdminEmail(e.target.value)
              setEmailAlreadyExists(false)
              setEmailExistsValidationError(false)
            }}
          />
          <Tooltip
            arrow
            className="tooltip4"
            title={
              <div style={{ fontSize: '1.2em', whiteSpace: 'pre-line' }}>
                {t('superAdmin.editOrganizations.adminEmailTooltip')}
              </div>
            }
            style={{
              marginBottom: isOrganizationAdminEmailValid ? '8px' : '30px',
            }}
          >
            <HelpIcon htmlColor={KnowitColors.darkBrown} fontSize={'medium'} />
          </Tooltip>
        </StyledContainer>
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
          <CenteredCircularProgress />
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
            onClick={
              organizationAdminEmail == ''
                ? addOrganization
                : addOrganizationIfEmailDoesNotExist
            }
          >
            <span>{t('add')}</span>
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default AddOrganizationDialog
