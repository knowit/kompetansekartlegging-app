import { FC, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import commonStyles from '../AdminPanel/common.module.css'
import Button from '../mui/Button'
import Table from '../mui/Table'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
} from '../../api/organizations'
import {
  Organization as Org,
  OrganizationInput,
} from '../../api/organizations/types'
import AddOrganizationDialog from './AddOrganizationDialog'
import DeleteOrganizationDialog from './DeleteOrganizationDialog'

interface OrganizationProps {
  organization: Org
  deleteOrganization: (id: Org) => void
}

const Organization: FC<OrganizationProps> = ({
  organization,
  deleteOrganization,
}) => {
  return (
    <>
      <TableRow>
        <TableCell>{organization.orgname}</TableCell>
        <TableCell>{organization.id}</TableCell>
        <TableCell>{organization.identifier_attribute}</TableCell>
        <TableCell align="center">
          <IconButton
            edge="end"
            onClick={() => deleteOrganization(organization)}
            size="large"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  )
}

interface OrganizationTableProps {
  organizations: Org[]
  deleteOrganization: (id: Org) => void
}

const OrganizationTable: FC<OrganizationTableProps> = ({
  organizations,
  deleteOrganization,
}) => {
  const { t } = useTranslation()

  return (
    <TableContainer className={commonStyles.tableContainer}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('name')}</TableCell>
            <TableCell>{t('superAdmin.editOrganizations.id')}</TableCell>
            <TableCell>{t('superAdmin.identifierAttribute')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {organizations.map((organization) => (
            <Organization
              organization={organization}
              deleteOrganization={deleteOrganization}
              key={organization.id}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const EditOrganizations = () => {
  const {
    data: organizations,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['edit_organizations'],
    queryFn: getAllOrganizations,
  })
  const { t } = useTranslation()

  const [mutationError, setMutationError] = useState<string>('')

  const [showAddOrganization, setShowAddOrganization] = useState<boolean>(false)
  const [showDeleteOrganization, setShowDeleteOrganization] =
    useState<boolean>(false)
  const [organizationToBeDeleted, setOrganizationToBeDeleted] =
    useState<Org | null>(null)

  const addOrganizationConfirm = (organization: OrganizationInput) => {
    createOrganization(organization)
      .then((res) => {
        setMutationError('')
      })
      .catch((err) => {
        setMutationError(err)
      })
      .finally(() => {
        setShowAddOrganization(false)
      })
  }

  const openDeleteOrganizationDialog = (organization: Org) => {
    setOrganizationToBeDeleted(organization)
    setShowDeleteOrganization(true)
  }

  const deleteOrganizationConfirm = (organization: Org) => {
    deleteOrganization(organization)
      .then((res) => {
        setMutationError('')
      })
      .catch((err) => {
        setMutationError(err)
      })
  }

  return (
    <Container maxWidth="md" className={commonStyles.container}>
      {error && <p>{t('errorOccured') + error}</p>}
      {mutationError && (
        <>
          <p>{t('errorOccured') + mutationError}</p>
        </>
      )}
      {isLoading && <CircularProgress />}
      {!error &&
        !isLoading &&
        organizations !== undefined &&
        organizations.data !== null && (
          <>
            <Card style={{ marginBottom: '24px' }} variant="outlined">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {t('menu.submenu.editOrganizations')}
                </Typography>
                {t('superAdmin.editOrganizations.description')}
              </CardContent>
            </Card>
            <OrganizationTable
              organizations={organizations.data}
              deleteOrganization={openDeleteOrganizationDialog}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              style={{ marginTop: '24px' }}
              onClick={() => setShowAddOrganization(true)}
            >
              {t('superAdmin.editOrganizations.addOrganization')}
            </Button>
          </>
        )}
      {showAddOrganization && (
        <AddOrganizationDialog
          open={showAddOrganization}
          onCancel={() => {
            setShowAddOrganization(false)
          }}
          onConfirm={addOrganizationConfirm}
        />
      )}
      {showDeleteOrganization && organizationToBeDeleted && (
        <DeleteOrganizationDialog
          open={showDeleteOrganization}
          onCancel={() => {
            setShowDeleteOrganization(false)
            setOrganizationToBeDeleted(null)
          }}
          onConfirm={(organization) => {
            setShowDeleteOrganization(false)
            setOrganizationToBeDeleted(null)
            deleteOrganizationConfirm(organization)
          }}
          organization={organizationToBeDeleted}
        />
      )}
    </Container>
  )
}

export default EditOrganizations
