import { useState } from 'react'

import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import { QuestionType } from '../../../API'
import { KnowitColors } from '../../../styles'
import CategoriesSelect from './CategoriesSelect'
import EditActionButtons from './EditActionButtons'

const useQuestionListStyles = makeStyles(() =>
  createStyles({
    listItemEdit: {
      backgroundColor: KnowitColors.darkBrown,
      padding: '16px',
      borderRadius: '16px',
      marginBottom: '10px',
      flexWrap: 'wrap',
    },
    listItemEditText: {
      color: KnowitColors.darkBrown,
      '& span': {
        fontWeight: 'bold',
      },
    },
    textField: {
      marginBottom: '16px',
      marginRight: '8px',
      '& input': {
        color: KnowitColors.white,
      },
      '& textarea': {
        color: KnowitColors.white,
      },
      '& label': {
        color: KnowitColors.white,
      },
      '& fieldset': {
        color: KnowitColors.white,
        border: '2px solid #F3C8BA',
        borderRadius: '15px',
        transition: 'border 100ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      },
    },
    questionType: {
      paddingLeft: '4px',
      marginBottom: '8px',
      '& legend': {
        color: KnowitColors.white,
        fontSize: '0.75rem',
      },
      '& span': {
        color: `${KnowitColors.white} !important`,
        fontSize: '0.75rem',
        fontWeight: 'normal',
      },
    },
  })
)

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
  const [topic, setTopic] = useState<string>(q.topic)
  const [text, setText] = useState<string>(q.text)
  const [categoryID, setCategoryID] = useState<string>(q.categoryID)
  const [questionConfig, setQuestionConfig] = useState<any>(initialConfig(q))
  const classes = useQuestionListStyles()

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
    <ListItem className={classes.listItemEdit}>
      <ListItemText
        primary={
          <>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                label="Emne"
                variant="outlined"
                value={topic}
                className={classes.textField}
                onChange={(e: any) => setTopic(e.target.value)}
                error={topic.length === 0}
                helperText={topic.length === 0 && 'Emnet kan ikke være tomt.'}
              />
              <CategoriesSelect
                categoryID={categoryID}
                setCategoryID={setCategoryID}
                categories={categories}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              minRows={4}
              maxRows={6}
              label="Beskrivelse"
              variant="outlined"
              error={text === ''}
              helperText={text === '' && 'Beskrivelsen kan ikke være tom.'}
              value={text}
              className={classes.textField}
              onChange={(e: any) => setText(e.target.value)}
            />
            <FormControl component="fieldset" className={classes.questionType}>
              <FormLabel component="legend">Spørsmålstype</FormLabel>
              <RadioGroup row value={questionType}>
                <FormControlLabel
                  disabled
                  value={QuestionType.KnowledgeMotivation}
                  control={<Radio />}
                  label="Kunnskap / Motivasjon"
                />
                <FormControlLabel
                  disabled
                  value={QuestionType.CustomScaleLabels}
                  control={<Radio />}
                  label="Egendefinerte skala overskrifter"
                />
              </RadioGroup>
            </FormControl>
            {isCustomScaleLabels && (
              <FormControl fullWidth component="fieldset">
                <Box display="flex" justifyContent="space-between">
                  <TextField
                    label="Start"
                    variant="outlined"
                    value={questionConfig.scaleStart}
                    className={classes.textField}
                    onChange={onQuestionConfigChange('scaleStart')}
                  />
                  <TextField
                    label="Midt"
                    variant="outlined"
                    value={questionConfig.scaleMiddle}
                    className={classes.textField}
                    onChange={onQuestionConfigChange('scaleMiddle')}
                  />
                  <TextField
                    label="Slutt"
                    variant="outlined"
                    value={questionConfig.scaleEnd}
                    className={classes.textField}
                    onChange={onQuestionConfigChange('scaleEnd')}
                  />
                </Box>
              </FormControl>
            )}
          </>
        }
        className={classes.listItemEditText}
      />
      <EditActionButtons
        disabled={!isCompleted}
        onSave={onSave}
        onCancel={onCancel}
      />
    </ListItem>
  )
}

export default QuestionListItemEdit
