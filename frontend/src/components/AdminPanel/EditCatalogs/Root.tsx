import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import DeleteIcon from '@mui/icons-material/Delete'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { Edit as EditIcon } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import commonStyles from '../common.module.css'
import useApiGet from '../useApiGet'
import { compareByCreatedAt } from '../helpers'
import {
  listAllFormDefinitionsForLoggedInUser,
  updateFormDefinitionCreatedAt,
  deleteFormDefinition,
  createFormDefinition,
  copyFormDefinition,
} from '../catalogApi'
import { Table, Button } from '@mui/material'
import TableRow from '@mui/material/TableRow'
import ActivateCatalogDialog from './ActivateCatalogDialog'
import DeleteCatalogDialog from './DeleteCatalogDialog'
import AddCatalogDialog from './AddCatalogDialog'
import { useTranslation } from 'react-i18next'
import { i18nDateToLocaleString } from '../../../i18n/i18n'
import CopyCatalogDialog from './CopyCatalogDialog'

const Catalog = ({
  catalog,
  deleteCatalog,
  active,
  activateCatalog,
  copyCatalog,
}: any) => {
  const { t } = useTranslation()
  const name = catalog.label || t('admin.editCatalogs.notSet')

  return (
    <>
      <TableRow selected={active}>
        <TableCell>{name}</TableCell>
        <TableCell>
          {i18nDateToLocaleString(new Date(catalog.updatedAt))}
        </TableCell>
        <TableCell align="right">
          <Button
            disabled={active}
            endIcon={<BookmarkIcon />}
            onClick={() => activateCatalog(catalog)}
          >
            {t('admin.editCatalogs.activateCatalog')}
          </Button>
        </TableCell>
        <TableCell align="right">
          <Link
            to={{
              pathname: `/edit/${catalog.id}`,
              search: `?label=${name}`,
            }}
          >
            <Button endIcon={<EditIcon />}>
              {t('admin.editCatalogs.modifyCatalog')}
            </Button>
          </Link>
        </TableCell>
        <TableCell align="right">
          <Button endIcon={<AddIcon />} onClick={() => copyCatalog(catalog)}>
            {t('admin.editCatalogs.copyCatalog')}
          </Button>
        </TableCell>
        <TableCell align="right">
          <Button
            endIcon={<DeleteIcon />}
            onClick={() => deleteCatalog(catalog)}
          >
            {t('admin.editCatalogs.removeCatalog')}
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}

const CatalogTable = ({
  catalogs,
  deleteCatalog,
  activateCatalog,
  copyCatalog,
}: any) => {
  const { t } = useTranslation()

  return (
    <TableContainer className={commonStyles.tableContainer}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('name')}</TableCell>
            <TableCell>{t('admin.editCatalogs.lastUpdated')}</TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {catalogs.map((c: any, ind: number) => (
            <Catalog
              key={c.id}
              catalog={c}
              deleteCatalog={deleteCatalog}
              activateCatalog={activateCatalog}
              copyCatalog={copyCatalog}
              active={ind === 0}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const Root = () => {
  const { t } = useTranslation()
  const {
    result: catalogs,
    error,
    loading,
    refresh,
  } = useApiGet({
    getFn: listAllFormDefinitionsForLoggedInUser,
    cmpFn: compareByCreatedAt,
  })

  const [showDeleteCatalogDialog, setShowDeleteCatalogDialog] =
    useState<boolean>(false)
  const [catalogToDelete, setCatalogToDelete] = useState<any>()
  const deleteCatalog = (catalog: any) => {
    setShowDeleteCatalogDialog(true)
    setCatalogToDelete(catalog)
  }
  const deleteCatalogConfirm = async () => {
    await deleteFormDefinition(catalogToDelete.id)
    setShowDeleteCatalogDialog(false)
    refresh()
  }

  const [showActivateCatalogDialog, setShowActivateCatalogDialog] =
    useState<boolean>(false)
  const [catalogToActivate, setCatalogToActivate] = useState<any>()
  const activateCatalog = (catalog: any) => {
    setShowActivateCatalogDialog(true)
    setCatalogToActivate(catalog)
  }
  const activateCatalogConfirm = async () => {
    await updateFormDefinitionCreatedAt(
      catalogToActivate,
      new Date().toISOString()
    )
    setShowActivateCatalogDialog(false)
    refresh()
  }

  const [showCopyCatalogDialog, setShowCopyCatalogDialog] =
    useState<boolean>(false)
  const [catalogToCopy, setCatalogToCopy] = useState<any>()
  const copyCatalog = (catalog: any) => {
    setShowCopyCatalogDialog(true)
    setCatalogToCopy(catalog)
  }
  const copyCatalogConfirm = async (newCatalogName: string) => {
    await copyFormDefinition(catalogToCopy.id, newCatalogName)
    setShowCopyCatalogDialog(false)
    refresh()
  }

  const [showAddCatalogDialog, setShowAddCatalogDialog] =
    useState<boolean>(false)
  const addCatalogConfirm = async (name: string) => {
    await createFormDefinition(name)
    setShowAddCatalogDialog(false)
    refresh()
  }

  return (
    <Container className={commonStyles.container}>
      {error && <p>{t('errorOccured') + error}</p>}
      {loading && <CircularProgress />}
      {!error && !loading && catalogs && (
        <>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('menu.submenu.editCatalogs')}
              </Typography>
              {t('admin.editCatalogs.description')}
            </CardContent>
          </Card>
          <CatalogTable
            catalogs={catalogs}
            deleteCatalog={deleteCatalog}
            activateCatalog={activateCatalog}
            copyCatalog={copyCatalog}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowAddCatalogDialog(true)}
          >
            {t('admin.editCatalogs.createNewCatalog')}
          </Button>
        </>
      )}
      {showAddCatalogDialog && (
        <AddCatalogDialog
          open={showAddCatalogDialog}
          onCancel={() => setShowAddCatalogDialog(false)}
          onConfirm={addCatalogConfirm}
        />
      )}
      <ActivateCatalogDialog
        open={showActivateCatalogDialog}
        onCancel={() => setShowActivateCatalogDialog(false)}
        onExited={() => setCatalogToActivate(null)}
        onConfirm={activateCatalogConfirm}
      />
      <DeleteCatalogDialog
        open={showDeleteCatalogDialog}
        onCancel={() => setShowDeleteCatalogDialog(false)}
        onExited={() => setCatalogToDelete(null)}
        onConfirm={deleteCatalogConfirm}
      />
      {showCopyCatalogDialog && (
        <CopyCatalogDialog
          open={showCopyCatalogDialog}
          onCancel={() => setShowCopyCatalogDialog(false)}
          onExited={() => setCatalogToCopy(null)}
          onConfirm={copyCatalogConfirm}
        />
      )}
    </Container>
  )
}

export default Root
