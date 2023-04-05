import { Button } from '@mui/material'
import React from 'react'
import { Panel, YourAnswerProps } from '../types'
import AnswerDiagram from './AnswerDiagram'
import { BlockInfo } from './BlockInfo'
import { Form } from './Form'
import ProgressBar from './ProgressBar'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'

interface HideableProps {
  hidden: boolean
}

const Hideable = styled.div<HideableProps>`
  display: ${(props) => (props.hidden ? 'block' : 'none')};
`
const StyledForm = styled.div()

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
    <>
      <Hideable hidden={!props.answerEditMode}>
        <h2>{props.activeCategory}</h2>
        <BlockInfo
          questions={props.questionAnswers.get(props.activeCategory)}
        />
        <Button onClick={() => props.enableAnswerEditMode()}>
          {t('myAnswers.fillOut')}
        </Button>
        <div>{getCategoryDescription()}</div>
        <AnswerDiagram
          questionAnswers={props.questionAnswers}
          activeCategory={props.activeCategory}
          isMobile={false}
        />
      </Hideable>

      <Hideable hidden={props.answerEditMode}>
        <StyledForm inEditMode={props.answerEditMode}>
          <ProgressBar
            alerts={props.alerts}
            totalQuestions={props.formDefinition?.questions.items.length ?? 0}
          />

          <div>{getCategoryDescription()}</div>

          <Form
            {...props}
            scrollToTop={scrollToTop}
            isMobile={false}
            alerts={props.alerts}
          />
        </StyledForm>
      </Hideable>
    </>
  )
}

export default YourAnswers
