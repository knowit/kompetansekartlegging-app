import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import IconButton from '@mui/material/IconButton'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'

import { QuestionType } from '../../../API'

import { CloseIcon } from '../../DescriptionTable'
import { useTranslation } from 'react-i18next'

const AddQuestionDialog = ({ onCancel, onConfirm, open }: any) => {
  const { t } = useTranslation()

  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [questionType, setQuestionType] = useState<QuestionType>(
    QuestionType.KnowledgeMotivation
  )
  const [questionConfig, setQuestionConfig] = useState<any>({})

  // const isKnowledgeMotivation =
  //     questionType === QuestionType.KnowledgeMotivation;
  const isCustomScaleLabels = questionType === QuestionType.CustomScaleLabels
  const isCompleted = (() => {
    if (topic === '' || description === '') return false
    return true
  })()

  const onQuestionTypeChange = (e: any) => {
    const qtype = e.target.value
    if (qtype === QuestionType.CustomScaleLabels) {
      setQuestionConfig({
        scaleStart: '',
        scaleMiddle: '',
        scaleEnd: '',
      })
    } else {
      setQuestionConfig({})
    }
    setQuestionType(qtype)
  }

  const onQuestionConfigChange = (property: string) => (e: any) => {
    e.persist() // what on god's green earth is this!?
    setQuestionConfig((config: any) => ({
      ...config,
      [property]: e.target.value,
    }))
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
          <span>{t('admin.editCatalogs.addNewQuestion')}</span>
          <IconButton onClick={onCancel} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          label={t('admin.editCatalogs.subjectOfTheNewQuestion')}
          variant="outlined"
          error={topic === ''}
          helperText={
            topic === '' && t('admin.editCatalogs.subjectCantBeEmpty')
          }
          value={topic}
          onChange={(e: any) => setTopic(e.target.value)}
        />
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={6}
          label={t('description')}
          variant="outlined"
          error={description === ''}
          helperText={
            description === '' && t('admin.editCatalogs.descriptionCantBeEmpty')
          }
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
        />
        <FormControl component="fieldset">
          <FormLabel component="legend">
            {t('admin.editCatalogs.typeOfQuestion')}
          </FormLabel>
          <RadioGroup row value={questionType} onChange={onQuestionTypeChange}>
            <FormControlLabel
              value={QuestionType.KnowledgeMotivation}
              control={<Radio />}
              label={t('admin.editCatalogs.competenceSlashMotivation')}
            />
            <FormControlLabel
              value={QuestionType.CustomScaleLabels}
              control={<Radio />}
              label={t('admin.editCatalogs.customScaleHeadlines')}
            />
          </RadioGroup>
        </FormControl>
        {isCustomScaleLabels && (
          <FormControl fullWidth component="fieldset">
            <Box display="flex" justifyContent="space-between">
              <TextField
                label={t('admin.editCatalogs.start')}
                variant="outlined"
                value={questionConfig.scaleStart}
                onChange={onQuestionConfigChange('scaleStart')}
              />
              <TextField
                label={t('admin.editCatalogs.middle')}
                variant="outlined"
                value={questionConfig.scaleMiddle}
                onChange={onQuestionConfigChange('scaleMiddle')}
              />
              <TextField
                label={t('admin.editCatalogs.end')}
                variant="outlined"
                value={questionConfig.scaleEnd}
                onChange={onQuestionConfigChange('scaleEnd')}
              />
            </Box>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>
          <span>{t('abort')}</span>
        </Button>
        <Button
          disabled={!isCompleted}
          onClick={() =>
            onConfirm(topic, description, questionType, questionConfig)
          }
        >
          <span>{t('add')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddQuestionDialog
