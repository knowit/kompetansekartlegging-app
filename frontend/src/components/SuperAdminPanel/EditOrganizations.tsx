import React, { useState } from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import commonStyles from '../AdminPanel/common.module.css'
import Button from '../mui/Button'
import Table from '../mui/Table'

import AddIcon from '@material-ui/icons/Add'
import useApiGet from '../AdminPanel/useApiGet'
import AddOrganizationDialog from './AddOrganizationDialog'
import DeleteOrganizationDialog from './DeleteOrganizationDialog'
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
} from '../../api/organizations'
import {
  Organization as Org,
  OrganizationInput,
} from '../../api/organizations/types'

interface OrganizationProps {
  organization: Org
  deleteOrganization: (id: Org) => void
}

const Organization: React.FC<OrganizationProps> = ({
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

const OrganizationTable: React.FC<OrganizationTableProps> = ({
  organizations,
  deleteOrganization,
}) => {
  return (
    <TableContainer className={commonStyles.tableContainer}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Navn</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Identifier Attribute</TableCell>
            <TableCell>Slett</TableCell>
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
    getFn: getAllOrganizations,
  })

  // [TODO] Hva skal vi ha i steden for mutationError?
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
        refreshOrganizations()
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
      .finally(() => {
        refreshOrganizations()
      })
  }

  return (
    <Container maxWidth="md" className={commonStyles.container}>
      {error && <p>An error occured: {error}</p>}
      {mutationError && (
        <>
          <p>An error occured: {mutationError}</p>
        </>
      )}
      {loading && <CircularProgress />}
      {!error && !loading && (
        <>
          <Card style={{ marginBottom: '24px' }} variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Rediger organisasjoner.
              </Typography>
              Her man man legge til, fjerne eller oppdatere organizasjoner.
            </CardContent>
          </Card>
          <OrganizationTable
            organizations={organizations}
            deleteOrganization={openDeleteOrganizationDialog}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            style={{ marginTop: '24px' }}
            onClick={() => setShowAddOrganization(true)}
          >
            Legg til organisasjon
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
