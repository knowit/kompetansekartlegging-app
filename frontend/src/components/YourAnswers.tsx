import { Button } from '@mui/material'
import React from 'react'
import { YourAnswerProps } from '../types'
import AnswerDiagram from './AnswerDiagram'
import { Form } from './Form'
import ProgressBar from './ProgressBar'
import { useTranslation } from 'react-i18next'
import InfoCard from './InfoCard'
import { QuestionAnswer } from '../types'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import UpdateIcon from '@mui/icons-material/Update'
import { staleAnswersLimit } from './Question'
import { i18nDateToLocaleDateString } from '../i18n/i18n'
import styled from '@emotion/styled'

const StyledBlockInfo = styled.div`
  display: flex;
  flex-direction: row;
`

const BlockInfo = (props: { questions: QuestionAnswer[] | undefined }) => {
  const { t } = useTranslation()

  enum TimeType {
    MINUTES, // For testing
    DAYS,
  }

  const timeBetweenString = (
    then: number,
    now: number,
    type: TimeType
  ): string => {
    switch (type) {
      case TimeType.MINUTES:
        return (
          Math.round((now - then) / (1000 * 60)) + ` ${t('myAnswers.minutes')}`
        )
      case TimeType.DAYS:
        return (
          Math.round((now - then) / (1000 * 60 * 60 * 24)) +
          ` ${t('myAnswers.days')}`
        )
    }
  }

  const questions = props.questions ?? []

  const answeredQuestions = questions.filter(
    (question) =>
      (question.motivation !== -1 && question.knowledge !== -1) ||
      (question.customScaleValue != null && question.customScaleValue >= 0)
  )

  if (questions.length > answeredQuestions.length)
    return (
      <StyledBlockInfo>
        <ErrorOutlineRoundedIcon color="warning" />
        <div>{t('myAnswers.blockHasNotBeenCompleted')}</div>
      </StyledBlockInfo>
    )

  const now = Date.now()
  let timeOfOldestQuestion = now
  answeredQuestions?.forEach((question) => {
    if (question.updatedAt < timeOfOldestQuestion)
      timeOfOldestQuestion = question.updatedAt
  })
  const timeDiff = now - timeOfOldestQuestion

  return (
    <StyledBlockInfo>
      {timeDiff > staleAnswersLimit ? (
        <>
          <UpdateIcon color="warning" />
          <div>
            {t('myAnswers.itHasBeenTimeSinceTheBlockWasUpdated', {
              time: timeBetweenString(timeOfOldestQuestion, now, TimeType.DAYS),
            })}
          </div>
        </>
      ) : (
        <>
          <CheckCircleOutlineRoundedIcon color="success" />
          <div>
            {t('myAnswers.theBlockWasLastUpdatedDate', {
              date: i18nDateToLocaleDateString(new Date(timeOfOldestQuestion)),
              interpolation: { escapeValue: false },
            })}
          </div>
        </>
      )}
    </StyledBlockInfo>
  )
}

const Info = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10px;
`

interface HideableProps {
  hidden: boolean
}

const Hideable = styled.div<HideableProps>`
  display: ${(props) => (props.hidden ? 'block' : 'none')};
`

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

  if (props.activeCategory === 'MAIN') {
    return <>{t('myAnswers.chooseCategory')}</>
  }

  return (
    <>
      <Hideable hidden={props.answerEditMode}>
        <ProgressBar
          alerts={props.alerts}
          totalQuestions={props.formDefinition?.questions.items.length ?? 0}
        />
      </Hideable>
      <InfoCard
        title={props.activeCategory}
        description={getCategoryDescription()}
      />
      <Hideable hidden={!props.answerEditMode}>
        <Info>
          <BlockInfo
            questions={props.questionAnswers.get(props.activeCategory)}
          />

          <Button
            variant="contained"
            onClick={() => props.enableAnswerEditMode()}
          >
            {t('myAnswers.fillOut')}
          </Button>
        </Info>

        <AnswerDiagram
          questionAnswers={props.questionAnswers}
          activeCategory={props.activeCategory}
          isSmall={props.isSmall}
        />
      </Hideable>

      <Hideable hidden={props.answerEditMode}>
        <Form
          {...props}
          scrollToTop={scrollToTop}
          isSmall={props.isSmall}
          alerts={props.alerts}
        />
      </Hideable>
    </>
  )
}

export default YourAnswers
