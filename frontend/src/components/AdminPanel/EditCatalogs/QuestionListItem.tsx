import { useState } from 'react'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Edit as EditIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material'
import QuestionListItemEdit from './QuestionListItemEdit'

const QuestionListItem = ({
  question: q,
  index: ind,
  moveQuestion,
  saveQuestion,
  deleteQuestion,
  enableUpdates,
  questions,
  categories,
}: any) => {
  const [editMode, setEditMode] = useState<boolean>(false)

  return editMode ? (
    <QuestionListItemEdit
      question={q}
      saveQuestion={saveQuestion}
      categories={categories}
      setEditMode={setEditMode}
    />
  ) : (
    <ListItem key={q.id}>
      <ListItemText
        primary={
          <>
            {ind + 1}. {q.topic}
            <div>
              <IconButton onClick={() => setEditMode(true)} size="large">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteQuestion(q)} size="large">
                <DeleteIcon />
              </IconButton>
              <ButtonGroup
                disableElevation
                variant="text"
                size="small"
                orientation="vertical"
              >
                <Button
                  size="small"
                  onClick={() => moveQuestion(q, 1)}
                  disabled={!enableUpdates || ind === 0}
                >
                  <KeyboardArrowUpIcon fontSize="small" />
                </Button>
                <Button
                  size="small"
                  onClick={() => moveQuestion(q, -1)}
                  disabled={!enableUpdates || ind === questions.length - 1}
                >
                  <KeyboardArrowDownIcon fontSize="small" />
                </Button>
              </ButtonGroup>
            </div>
          </>
        }
        secondary={q.text}
      />
    </ListItem>
  )
}

export default QuestionListItem
