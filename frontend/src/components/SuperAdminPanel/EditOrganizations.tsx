import { FC, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import DeleteIcon from '@mui/icons-material/Delete'
import commonStyles from '../AdminPanel/common.module.css'
import { Button } from '@mui/material'
import { Table } from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import useApiGet from '../AdminPanel/useApiGet'
import AddOrganizationDialog from './AddOrganizationDialog'
import DeleteOrganizationDialog from './DeleteOrganizationDialog'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'
import {
  addOrganization,
  getOrganizations,
  removeOrganization,
} from './SuperAdminAPI'
import { OrganizationInfo } from './SuperAdminTypes'
import InfoCard from '../InfoCard'

interface OrganizationProps {
  organization: OrganizationInfo
  deleteOrganization: (id: OrganizationInfo) => void
}

const Organization: FC<OrganizationProps> = ({
  organization,
  deleteOrganization,
}) => {
  return (
    <>
      <TableRow>
        <TableCell>{organization.name}</TableCell>
        <TableCell>{organization.id}</TableCell>
        <TableCell>{organization.identifierAttribute}</TableCell>
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
  organizations: OrganizationInfo[]
  deleteOrganization: (id: OrganizationInfo) => void
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
    result: organizations,
    error,
    loading,
    refresh: refreshOrganizations,
  } = useApiGet({
    getFn: getOrganizations,
  })

  const [mutationError, setMutationError] = useState<string>('')

  const [showAddOrganization, setShowAddOrganization] = useState<boolean>(false)
  const [showDeleteOrganization, setShowDeleteOrganization] =
    useState<boolean>(false)
  const [organizationToBeDeleted, setOrganizationToBeDeleted] =
    useState<OrganizationInfo | null>(null)

  const addOrganizationConfirm = (
    organization: OrganizationInfo,
    adminEmail: string
  ) => {
    addOrganization(organization, adminEmail)
      .then(() => {
        setMutationError('')
      })
      .catch((err) => {
        setMutationError(err)
      })
      .finally(() => {
        setShowAddOrganization(false)
        refreshOrganizations()
      })
  }

  const openDeleteOrganizationDialog = (organization: OrganizationInfo) => {
    setOrganizationToBeDeleted(organization)
    setShowDeleteOrganization(true)
  }

  const deleteOrganizationConfirm = (organization: OrganizationInfo) => {
    removeOrganization(organization)
      .then(() => {
        setMutationError('')
      })
      .catch((err) => {
        setMutationError(err)
      })
      .finally(() => {
        refreshOrganizations()
      })
  }

  return (
    <>
      {error && <p>{t('errorOccured') + error}</p>}
      {mutationError && (
        <>
          <p>{t('errorOccured') + mutationError}</p>
        </>
      )}
      {loading && <CircularProgress />}
      {!error && !loading && (
        <>
          <InfoCard
            title="menu.submenu.editOrganizations"
            description="superAdmin.editOrganizations.description"
          />
          <OrganizationTable
            organizations={organizations}
            deleteOrganization={openDeleteOrganizationDialog}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
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
    </>
  )
}

export default EditOrganizations
