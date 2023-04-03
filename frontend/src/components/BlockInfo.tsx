import { KnowitColors } from '../styles'
import { QuestionAnswer } from '../types'
import React from 'react'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import UpdateIcon from '@mui/icons-material/Update'
import { staleAnswersLimit } from './AlertNotification'
import { useTranslation } from 'react-i18next'
import { i18nDateToLocaleDateString } from '../i18n/i18n'

export enum AlertType {
  Incomplete,
  Outdated,
  Multiple,
}

export const BlockInfo = (props: {
  questions: QuestionAnswer[] | undefined
}) => {
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
        return Math.round((now - then) / (1000 * 60)) + t('myAnswers.minutes')
      case TimeType.DAYS:
        return (
          Math.round((now - then) / (1000 * 60 * 60 * 24)) + t('myAnswers.days')
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
      <div>
        <div>
          <ErrorOutlineRoundedIcon />
          <div>{t('myAnswers.blockHasNotBeenCompleted')}</div>
        </div>
      </div>
    )

  const now = Date.now()
  let timeOfOldestQuestion = now
  answeredQuestions?.forEach((question) => {
    if (question.updatedAt < timeOfOldestQuestion)
      timeOfOldestQuestion = question.updatedAt
  })
  const timeDiff = now - timeOfOldestQuestion
  if (timeDiff > staleAnswersLimit) {
    return (
      <div>
        <div>
          <UpdateIcon />
          <div>
            {t('myAnswers.itHasBeenTimeSinceTheBlockWasUpdated', {
              time: timeBetweenString(timeOfOldestQuestion, now, TimeType.DAYS),
            })}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div>
          <CheckCircleOutlineRoundedIcon />
          <div>
            {t('myAnswers.theBlockWasLastUpdatedDate', {
              date: i18nDateToLocaleDateString(new Date(timeOfOldestQuestion)),
              interpolation: { escapeValue: false },
            })}
          </div>
        </div>
      </div>
    )
  }
}
