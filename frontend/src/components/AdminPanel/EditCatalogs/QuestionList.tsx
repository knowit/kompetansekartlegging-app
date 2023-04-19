import { useState } from 'react'

import List from '@material-ui/core/List'

import { Question, QuestionInput } from '../../../api/questions/types'
import {
  deleteQuestion as deleteQuestionApi,
  updateQuestion,
} from '../../../api/questions/index'
import DeleteQuestionDialog from './DeleteQuestionDialog'
import QuestionListItem from './QuestionListItem'

type QuestionListProps = {
  id: string
  categories: any[]
  questions: Question[]
  formDefinitionID: string
  formDefinitionLabel: string | null
  refreshQuestions: any
}

const QuestionList = ({
  id,
  categories,
  questions,
  formDefinitionID,
  formDefinitionLabel,
  refreshQuestions,
}: QuestionListProps) => {
  const [enableUpdates, setEnableUpdates] = useState<boolean>(true)

  const [showDeleteQuestionDialog, setShowDeleteQuestionDialog] =
    useState<boolean>(false)
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>()
  const deleteQuestion = (question: Question) => {
    setShowDeleteQuestionDialog(true)
    setQuestionToDelete(question)
  }
  const deleteQuestionConfirm = async () => {
    if (questionToDelete) {
      await deleteQuestionApi(questionToDelete.id)
    }
    setShowDeleteQuestionDialog(false)
  }

  const moveQuestion = async (question: Question, direction: number) => {
    setEnableUpdates(false)

    const me = question
    const questionsCopy = [...questions]
    questionsCopy.sort((qA, qB) => qB.index - qA.index)

    const swapWith =
      questionsCopy[
        questionsCopy.findIndex((q) => q.index === question.index) + direction
      ]

    const questionInput: QuestionInput = me
    questionInput.index = swapWith.index
    const swapWithInput: QuestionInput = swapWith
    swapWithInput.index = me.index

    await updateQuestion(me.id, questionInput)
    await updateQuestion(swapWith.id, swapWith)

    setEnableUpdates(true)
  }

  const saveQuestion = async (
    question: Question,
    topic: string,
    text: string,
    categoryID: string,
    questionConfig: any
  ) => {
    const questionInput: QuestionInput = question
    questionInput.topic = topic
    questionInput.text = text
    questionInput.category_id = categoryID
    await updateQuestion(question.id, questionInput)
  }

  return (
    <>
      {questions.length === 0 && <p>Ingen spørsmål i denne kategorien ennå.</p>}
      <List>
        {questions.map((q: Question, index: number) => (
          <QuestionListItem
            key={q.id}
            question={q}
            index={index}
            moveQuestion={moveQuestion}
            saveQuestion={saveQuestion}
            deleteQuestion={deleteQuestion}
            enableUpdates={enableUpdates}
            questions={questions}
            categories={categories}
          />
        ))}
      </List>
      {questionToDelete && (
        <DeleteQuestionDialog
          open={showDeleteQuestionDialog}
          onCancel={() => setShowDeleteQuestionDialog(false)}
          onExited={() => setQuestionToDelete(null)}
          onConfirm={deleteQuestionConfirm}
          question={questionToDelete}
        />
      )}
    </>
  )
}

export default QuestionList
