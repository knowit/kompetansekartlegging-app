import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TreeView from '@mui/lab/TreeView'
import {
  AnswerHistoryProps,
  HistoryTreeViewProps,
  UserAnswer,
  UserFormWithAnswers,
} from '../types'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TreeItem from '@mui/lab/TreeItem'

import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

function* generator() {
  let i = 0
  while (true) {
    yield i++
  }
}

const formatDate = (dateString: string) => {
  const temp: string[] = dateString.split('T')
  return temp[0] + '  ' + temp[1].slice(0, 5)
}

const parseScore = (
  score: number,
  t: TFunction<'translation', undefined, 'translation'>
) => {
  return score < 0 ? t('content.notAnswered') : score
}

export const AnswerHistory = ({ ...props }: AnswerHistoryProps) => {
  const { t } = useTranslation()

  const handleClose = () => {
    props.setHistoryViewOpen(false)
  }

  const HistoryTreeView = ({ ...props }: HistoryTreeViewProps) => {
    const g = generator()

    const renderEntry = (entry: UserFormWithAnswers) => {
      const key = String(g.next().value)
      return (
        <TreeItem key={key} nodeId={key} label={formatDate(entry.createdAt)}>
          {entry.questionAnswers.items.map((answer) => renderAnswer(answer))}
        </TreeItem>
      )
    }

    const renderAnswer = (answer: UserAnswer) => {
      const key = String(g.next().value)
      return (
        <TreeItem
          key={key}
          nodeId={key}
          label={findQuestion(answer.question.id)}
        >
          <TreeItem
            nodeId={String(g.next().value)}
            label={t('competence') + ': ' + parseScore(answer.knowledge, t)}
          />
          <TreeItem
            nodeId={String(g.next().value)}
            label={t('motivation') + ': ' + parseScore(answer.motivation, t)}
          />
        </TreeItem>
      )
    }

    const sortedData = props.data.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    )

    return (
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={['root']}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {sortedData.map((entry) => renderEntry(entry))}
      </TreeView>
    )
  }

  const findQuestion = (questionId: string): string => {
    const question = props.formDefinition?.questions.items.find(
      (q) => q.id === questionId
    )
    return question
      ? question?.category.text + ': ' + question?.topic
      : t('content.notDefined')
  }

  return (
    <div>
      <Dialog
        open={props.historyViewOpen}
        onClose={handleClose}
        scroll={'body'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          {t('content.answerHistory')}
        </DialogTitle>
        <DialogContent dividers={true}>
          <HistoryTreeView data={props.history} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
