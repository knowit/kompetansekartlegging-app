import { useState } from 'react'

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import ListItem from '@mui/material/ListItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

import { QuestionType } from '../../../API'
import CategoriesSelect from './CategoriesSelect'
import { useTranslation } from 'react-i18next'
import EditActionButtons from './EditActionButtons'
import TextField from '@mui/material/TextField'
import styled from '@emotion/styled'
import { Card, CardContent } from '@mui/material'

const StyledItemEdit = styled.div`
  display: flex;
  flex-direction: column;

    .subjectCategory {
      display: flex;
      flex-wrap: wrap;

      > * {
        margin-bottom: 10px;
      }

      .questionSubject {
        flex-grow: 4;
      }

      .questionCategory {
        flex-grow: 1;
      }
    }
  }
`

const initialConfig = (q: any) => {
  if (q.type === QuestionType.CustomScaleLabels) {
    return {
      scaleStart: q.scaleStart,
      scaleMiddle: q.scaleMiddle,
      scaleEnd: q.scaleEnd,
    }
  }

  return {}
}

const QuestionListItemEdit = ({
  question: q,
  saveQuestion,
  categories,
  setEditMode,
}: any) => {
  const { t } = useTranslation()

  const [topic, setTopic] = useState<string>(q.topic)
  const [text, setText] = useState<string>(q.text)
  const [categoryID, setCategoryID] = useState<string>(q.categoryID)
  const [questionConfig, setQuestionConfig] = useState<any>(initialConfig(q))

  const questionType = q.type || QuestionType.KnowledgeMotivation
  const isCustomScaleLabels = questionType === QuestionType.CustomScaleLabels

  const onQuestionConfigChange = (property: string) => (e: any) => {
    e.persist()
    setQuestionConfig((config: any) => ({
      ...config,
      [property]: e.target.value,
    }))
  }

  const isCompleted = (() => {
    if (topic === '' || text === '') return false
    return true
  })()

  const onSave = async () => {
    try {
      await saveQuestion(q, topic, text, categoryID, questionConfig)
      setEditMode(false)
    } catch (e) {}
  }

  const onCancel = () => {
    setTopic(q.topic)
    setText(q.text)
    setCategoryID(q.categoryID)
    setQuestionConfig(initialConfig(q))
    setEditMode(false)
  }

  return (
    <ListItem>
      <StyledItemEdit>
        <Card>
          <CardContent className="questionContent">
            <div className="subjectCategory">
              <TextField
                className="questionSubject"
                label={t('admin.editCatalogs.subject')}
                variant="outlined"
                value={topic}
                onChange={(e: any) => setTopic(e.target.value)}
                error={topic.length === 0}
                helperText={
                  topic.length === 0 &&
                  t('admin.editCatalogs.subjectCantBeEmpty')
                }
              />
              <CategoriesSelect
                className="questionCategory"
                categoryID={categoryID}
                setCategoryID={setCategoryID}
                categories={categories}
              />
            </div>

            <TextField
              fullWidth
              multiline
              minRows={4}
              maxRows={6}
              label={t('description')}
              variant="outlined"
              error={text === ''}
              helperText={
                text === '' && t('admin.editCatalogs.descriptionCantBeEmpty')
              }
              value={text}
              onChange={(e: any) => setText(e.target.value)}
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">
                {t('admin.editCatalogs.typeOfQuestion')}
              </FormLabel>
              <RadioGroup row value={questionType}>
                <FormControlLabel
                  disabled
                  value={QuestionType.KnowledgeMotivation}
                  control={<Radio />}
                  label={t('admin.editCatalogs.competenceSlashMotivation')}
                />
                <FormControlLabel
                  disabled
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
            <EditActionButtons
              disabled={!isCompleted}
              onSave={onSave}
              onCancel={onCancel}
            />
          </CardContent>
        </Card>
      </StyledItemEdit>
    </ListItem>
  )
}

export default QuestionListItemEdit
