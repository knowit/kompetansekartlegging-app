import { makeStyles } from '@material-ui/core'
import { KnowitColors } from '../styles'
import { QuestionAnswer } from '../types'
import React from 'react'
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded'
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded'
import UpdateIcon from '@material-ui/icons/Update'
import { staleAnswersLimit } from './AlertNotification'
import { useTranslation } from 'react-i18next'
import { i18nDateToLocaleDateString } from '../i18n/i18n'

const useStyles = makeStyles({
  root: {},
  blockOK: {
    display: 'flex',
    justifyContent: 'flex-end',
    fontWeight: 'normal',
    alignItems: 'center',
    padding: 5,
    color: KnowitColors.darkBrown,
  },
  blockAlert: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 5,
    fontWeight: 'bold',
    color: KnowitColors.fuchsia,
  },
  warningText: {
    fontFamily: 'Arial',
    fontSize: '14px',
    marginLeft: 10,
    color: KnowitColors.darkBrown,
  },
})

export enum AlertType {
  Incomplete,
  Outdated,
  Multiple,
}

export const BlockInfo = (props: {
  questions: QuestionAnswer[] | undefined
}) => {
  const { t } = useTranslation()
  const classes = useStyles()

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
      <div className={classes.root}>
        <div className={classes.blockAlert}>
          <ErrorOutlineRoundedIcon />
          <div className={classes.warningText}>
            {t('myAnswers.blockHasNotBeenCompleted')}
          </div>
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
      <div className={classes.root}>
        <div className={classes.blockAlert}>
          <UpdateIcon />
          <div className={classes.warningText}>
            {t('myAnswers.itHasBeenTimeSinceTheBlockWasUpdated', {
              time: timeBetweenString(timeOfOldestQuestion, now, TimeType.DAYS),
            })}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className={classes.root}>
        <div className={classes.blockOK}>
          <CheckCircleOutlineRoundedIcon />
          <div className={classes.warningText}>
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
