import { useState } from 'react'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Edit as EditIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material'
import QuestionListItemEdit from './QuestionListItemEdit'
import { ListItem } from '@mui/material'
import styled from '@emotion/styled'

const StyledQuestionItem = styled.div`
  display: flex;
  justify-content: space-between;

  .qItemDesc {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .qText {
      font-size: 0.8em;
    }
  }

  .qItemButtons {
    display: flex;
    justify-content: center;
  }
`

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
    <ListItem divider key={q.id}>
      <ListItemText>
        <StyledQuestionItem>
          <div className="qItemDesc">
            <p>
              {ind + 1}. {q.topic}
            </p>
            <p className="qText">{q.text}</p>
          </div>
          <div className="qItemButtons">
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
        </StyledQuestionItem>
      </ListItemText>
    </ListItem>
  )
}

export default QuestionListItem
