import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material'

const EditActionButtons = ({ onSave, onCancel, disabled }: any) => {
  const { t } = useTranslation()

  return (
    <div>
      <Button onClick={onCancel}>
        <span>{t('abort')}</span>
      </Button>
      <Button disabled={disabled} onClick={onSave}>
        <span>{t('save')}</span>
      </Button>
    </div>
  )
}

export default EditActionButtons
