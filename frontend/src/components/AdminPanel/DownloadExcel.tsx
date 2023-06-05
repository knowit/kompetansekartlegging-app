import { useState } from 'react'
import { listAllFormDefinitionsForLoggedInUser } from './catalogApi'
import useApiGet from './useApiGet'
import { API, Auth } from 'aws-amplify'
import GetAppIcon from '@mui/icons-material/GetApp'
import CenteredCircularProgress from '../CenteredCircularProgress'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Button } from '@mui/material'
import { Table } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { i18nDateToLocaleDateString } from '../../i18n/i18n'
import InfoCard from '../InfoCard'

type FormDefinition = {
  id: string
  label: string
  createdAt: string
  updatedAt: string
}

interface FormDefinitions {
  formDefinitions: FormDefinition[]
}

const DownloadExcel = () => {
  const { t } = useTranslation()

  const {
    result: formDefinitions,
    error,
    loading,
  } = useApiGet({
    getFn: listAllFormDefinitionsForLoggedInUser,
  })

  return (
    <>
      <InfoCard
        title="menu.submenu.downloadCatalogs"
        description="admin.downloadCatalogs.description"
      />
      {error && <p>{t('errorOccured') + error}</p>}
      {loading && <CenteredCircularProgress />}
      {!error && !loading && formDefinitions && (
        <DownloadExcelTable formDefinitions={formDefinitions} />
      )}
    </>
  )
}

const DownloadExcelTable = ({ formDefinitions }: FormDefinitions) => {
  const { t } = useTranslation()
  const [idOfDownloadingForm, setIdOfDownloadingForm] = useState<string>('')
  const [isExcelError, setIsExcelError] = useState<boolean>(false)

  const downloadExcel = async (formDefId: string, formDefLabel: string) => {
    setIsExcelError(false)
    setIdOfDownloadingForm(formDefId)
    try {
      const data = await API.get('CreateExcelAPI', '', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
        queryStringParameters: {
          formDefId: `${formDefId}`,
          formDefLabel: `${formDefLabel}`,
        },
      })
      download(data, 'report.xlsx')
      setIdOfDownloadingForm('')
    } catch (e) {
      setIsExcelError(true)
    }
  }

  const download = (path: string, filename: string) => {
    // Create a new link
    const anchor = document.createElement('a')
    anchor.href = path
    anchor.download = filename

    // Append to the DOM
    document.body.appendChild(anchor)

    // Trigger `click` event
    anchor.click()

    // Remove element from DOM
    document.body.removeChild(anchor)
  }

  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('admin.downloadCatalogs.catalog')}</TableCell>
            <TableCell>{t('admin.downloadCatalogs.created')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {formDefinitions.map((formDef: FormDefinition) => (
            <TableRow key={formDef.id}>
              <TableCell>{formDef.label}</TableCell>
              <TableCell>
                {i18nDateToLocaleDateString(new Date(formDef.createdAt))}
              </TableCell>
              <TableCell align="center">
                <div>
                  {formDef.id === idOfDownloadingForm ? (
                    <>
                      {isExcelError ? (
                        <p>
                          {t(
                            'admin.downloadCatalogs.downloadFailedIsTheCatalogEmpty'
                          )}
                        </p>
                      ) : (
                        <CenteredCircularProgress />
                      )}
                    </>
                  ) : (
                    <Button
                      endIcon={<GetAppIcon />}
                      onClick={() => {
                        downloadExcel(formDef.id, formDef.label)
                      }}
                    >
                      {t('admin.downloadCatalogs.download')}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DownloadExcel
