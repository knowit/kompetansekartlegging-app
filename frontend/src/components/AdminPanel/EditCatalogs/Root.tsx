import { useState } from 'react'
import { Link } from 'react-router-dom'
import CenteredCircularProgress from '../../CenteredCircularProgress'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import DeleteIcon from '@mui/icons-material/Delete'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { Edit as EditIcon } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
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
import InfoCard from '../../InfoCard'
import { KnowitColors } from '../../../styleconstants'

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
            sx={{ color: KnowitColors.black }}
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
            style={{ textDecoration: 'none' }}
          >
            <Button endIcon={<EditIcon />} sx={{ color: KnowitColors.black }}>
              {t('admin.editCatalogs.modifyCatalog')}
            </Button>
          </Link>
        </TableCell>
        <TableCell align="right">
          <Button
            endIcon={<AddIcon />}
            onClick={() => copyCatalog(catalog)}
            sx={{ color: KnowitColors.black }}
          >
            {t('admin.editCatalogs.copyCatalog')}
          </Button>
        </TableCell>
        <TableCell align="right">
          <Button
            endIcon={<DeleteIcon />}
            onClick={() => deleteCatalog(catalog)}
            sx={{ color: KnowitColors.black }}
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
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('name')}</TableCell>
            <TableCell>{t('admin.editCatalogs.lastUpdated')}</TableCell>
            <TableCell />
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
    <>
      {error && <p>{t('errorOccured') + error}</p>}
      {loading && <CenteredCircularProgress />}
      {!error && !loading && catalogs && (
        <>
          <InfoCard
            title="menu.submenu.editCatalogs"
            description="admin.editCatalogs.description"
          />
          <CatalogTable
            catalogs={catalogs}
            deleteCatalog={deleteCatalog}
            activateCatalog={activateCatalog}
            copyCatalog={copyCatalog}
          />
          <Button
            variant="contained"
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
    </>
  )
}

export default Root
