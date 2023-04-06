import React, { useState } from 'react'

import { CardContent, Typography } from '@mui/material'
import { listAllFormDefinitionsForLoggedInUser } from './catalogApi'
import useApiGet from './useApiGet'
import { API, Auth } from 'aws-amplify'

import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import GetAppIcon from '@mui/icons-material/GetApp'
import CircularProgress from '@mui/material/CircularProgress'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Button } from '@mui/material'
import { Table } from '@mui/material'
import commonStyles from './common.module.css'
import { useTranslation } from 'react-i18next'
import { i18nDateToLocaleDateString } from '../../i18n/i18n'

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
    <Container className={commonStyles.container}>
      <Card style={{ marginBottom: '24px' }} variant="outlined">
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            {t('menu.submenu.downloadCatalogs')}
          </Typography>
          {t('admin.downloadCatalogs.description')}
        </CardContent>
      </Card>
      {error && <p>{t('errorOccured') + error}</p>}
      {loading && <CircularProgress />}
      {!error && !loading && formDefinitions && (
        <DownloadExcelTable formDefinitions={formDefinitions} />
      )}
    </Container>
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
                <div
                  style={{
                    height: '5.65rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {formDef.id === idOfDownloadingForm ? (
                    <>
                      {isExcelError ? (
                        <p
                          style={{
                            whiteSpace: 'pre-wrap',
                            margin: '0 auto',
                          }}
                        >
                          {t(
                            'admin.downloadCatalogs.downloadFailedIsTheCatalogEmpty'
                          )}
                        </p>
                      ) : (
                        <CircularProgress style={{ margin: '0 auto' }} />
                      )}
                    </>
                  ) : (
                    <Button
                      style={{ margin: '0 auto' }}
                      variant="contained"
                      color="primary"
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
