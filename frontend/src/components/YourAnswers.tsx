import { Button } from '@mui/material'
import React from 'react'
import { Panel, YourAnswerProps } from '../types'
import AnswerDiagram from './AnswerDiagram'
import { BlockInfo } from './BlockInfo'
import { Form } from './Form'
import ProgressBar from './ProgressBar'
import { useTranslation } from 'react-i18next'

const cardCornerRadius = 40
const zIndex = 20

export const YourAnswers = ({ ...props }: YourAnswerProps) => {
  const { t } = useTranslation()

  const scrollRef = React.useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    scrollRef.current?.scroll(0, 0)
  }

  const getCategoryDescription = (): string => {
    const categoryDesc = props.formDefinition?.questions.items.find(
      (q) => q.category.text === props.activeCategory
    )
    return categoryDesc?.category.description ?? ''
  }

  return (
    <div>
      <div>
        <div>
          <div>{props.activeCategory}</div>
          <div>
            <BlockInfo
              questions={props.questionAnswers.get(props.activeCategory)}
            />
            <Button onClick={() => props.enableAnswerEditMode()}>
              {t('myAnswers.fillOut')}
            </Button>
          </div>
        </div>
        <div>{getCategoryDescription()}</div>

        <div>
          <AnswerDiagram
            questionAnswers={props.questionAnswers}
            activeCategory={props.activeCategory}
            isMobile={false}
          />
        </div>
      </div>
      <div>
        <div>
          <ProgressBar
            alerts={props.alerts}
            totalQuestions={props.formDefinition?.questions.items.length ?? 0}
          />
          <h2>{props.activeCategory}</h2>
        </div>

        <div>
          <div>{getCategoryDescription()}</div>

          <Form
            {...props}
            scrollToTop={scrollToTop}
            isMobile={false}
            alerts={props.alerts}
          />
        </div>
      </div>
    </div>
  )
}

export default YourAnswers
