import { useState } from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import IconButton from '@material-ui/core/IconButton'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import TextField from '@material-ui/core/TextField'

import { useTranslation } from 'react-i18next'
import { QuestionType } from '../../../API'
import { dialogStyles } from '../../../styles'
import { CloseIcon } from '../../DescriptionTable'

const AddQuestionDialog = ({ onCancel, onConfirm, open }: any) => {
  const { t } = useTranslation()
  const style = dialogStyles()
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
      maxWidth="sm"
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
          <span className={style.dialogTitleText}>
            {t('admin.editCatalogs.addNewQuestion')}
          </span>
          <IconButton className={style.closeButton} onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          autoFocus
          fullWidth
          label={t('admin.editCatalogs.subjectOfTheNewQuestion')}
          variant="outlined"
          error={topic === ''}
          helperText={
            topic === '' && t('admin.editCatalogs.subjectCantBeEmpty')
          }
          value={topic}
          className={style.textField}
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
          className={style.textField}
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
                className={style.textField}
                onChange={onQuestionConfigChange('scaleStart')}
              />
              <TextField
                label={t('admin.editCatalogs.middle')}
                variant="outlined"
                value={questionConfig.scaleMiddle}
                className={style.textField}
                onChange={onQuestionConfigChange('scaleMiddle')}
              />
              <TextField
                label={t('admin.editCatalogs.end')}
                variant="outlined"
                value={questionConfig.scaleEnd}
                className={style.textField}
                onChange={onQuestionConfigChange('scaleEnd')}
              />
            </Box>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions className={style.alertButtons}>
        <Button onClick={onCancel} className={style.cancelButton}>
          <span className={style.buttonText}>{t('abort')}</span>
        </Button>
        <Button
          disabled={!isCompleted}
          onClick={() =>
            onConfirm(topic, description, questionType, questionConfig)
          }
          className={style.confirmButton}
        >
          <span className={style.buttonText}>{t('add')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddQuestionDialog
