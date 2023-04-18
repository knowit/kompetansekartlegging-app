import React from 'react'
import { QuestionType } from '../API'
import { QuestionProps, SliderKnowledgeMotivationValues } from '../types'
import Slider from './Slider'
import * as Icon from '../icons/iconController'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { Tooltip } from '@mui/material'
import {
  NotificationsActiveOutlined,
  PriorityHigh,
  Update,
} from '@mui/icons-material'
import { Millisecs } from '../helperFunctions'

// Time passed before answers are flagged a's stale and alerts are displayed
export const staleAnswersLimit: number = Millisecs.THREEMONTHS

export enum AlertType {
  Incomplete,
  Outdated,
  Multiple,
}

const StyledQuestion = styled.div`
  margin-top: 5vh;
  .questionTopic {
    display: inline;
  }

  .sliderContainer {
    display: grid;
    grid-template-columns: 1fr 4fr;
    align-items: center;
  }
`

const Question = ({ ...props }: QuestionProps) => {
  const question = props.questionAnswer.question
  const questionId = question.id
  const questionType = question.type || QuestionType.KnowledgeMotivation
  const questionTopic = question.topic
  const questionText = question.text
  const sliderValues = props.sliderValues.get(questionId)

  const sliderChanged = (newValue: number, motivation: boolean) => {
    props.setIsCategorySubmitted(false)
    if (sliderValues) {
      if (questionType === QuestionType.KnowledgeMotivation) {
        const sv = sliderValues as SliderKnowledgeMotivationValues
        if (motivation) {
          props.setSliderValues(questionId, {
            knowledge: sv.knowledge || 0,
            motivation: newValue,
          })
        } else {
          props.setSliderValues(questionId, {
            knowledge: newValue,
            motivation: sv.motivation || 0,
          })
        }
      } else if (questionType === QuestionType.CustomScaleLabels) {
        props.setSliderValues(questionId, {
          customScaleValue: newValue,
        })
      }
    }
  }

  const hasAlerts = props.alerts?.qidMap.has(questionId)
  let alertType = props.alerts?.qidMap.get(questionId)?.type
  let alertMessage = props.alerts?.qidMap.get(questionId)?.message
  let badgeContent = <></>
  if (hasAlerts) {
    alertType = props.alerts?.qidMap.get(questionId)?.type
    alertMessage = props.alerts?.qidMap.get(questionId)?.message
    switch (alertType) {
      case AlertType.Incomplete:
        badgeContent = (
          <PriorityHigh
            color="warning"
            aria-label={alertMessage}
            fontSize="small"
          />
        )
        break
      case AlertType.Outdated:
        badgeContent = (
          <Update color="warning" aria-label={alertMessage} fontSize="small" />
        )
        break
      case AlertType.Multiple:
        badgeContent = (
          <NotificationsActiveOutlined color="warning" fontSize="small" />
        )
        break
    }
  }

  return (
    <StyledQuestion>
      <div>
        <h2 className="questionTopic">{questionTopic}</h2>
        {hasAlerts && <Tooltip title={alertMessage}>{badgeContent}</Tooltip>}
        <div>{questionText}</div>
      </div>
      {questionType === QuestionType.KnowledgeMotivation && (
        <KnowledgeMotivationSliders
          sliderValues={sliderValues}
          sliderChanged={sliderChanged}
          isSmall={props.isSmall}
        />
      )}
      {questionType === QuestionType.CustomScaleLabels && (
        <CustomLabelSlider
          question={question}
          sliderValues={sliderValues}
          sliderChanged={sliderChanged}
          isSmall={props.isSmall}
        />
      )}
    </StyledQuestion>
  )
}

const StyledQuestionContainer = styled.div`
  .iconContainer {
    width: 100%;
    height: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    svg {
      height: 100%;
    }
  }
`

const KnowledgeMotivationSliders = ({
  sliderValues,
  sliderChanged,
  isSmall,
}: any) => {
  const { t } = useTranslation()

  return (
    <StyledQuestionContainer>
      <div className="sliderContainer">
        <h3>{t('competence')}</h3>
        <div>
          <div className="iconContainer">{Icon.GetIcons(true)}</div>
          <Slider
            value={sliderValues?.knowledge || -2}
            motivation={false}
            sliderChanged={sliderChanged}
            isSmall={isSmall}
          />
        </div>
      </div>
      <div className="sliderContainer">
        <h3>{t('motivation')}</h3>
        <div>
          <div className="iconContainer">{Icon.GetIcons(false)}</div>
          <Slider
            value={sliderValues?.motivation || -2}
            motivation={true}
            sliderChanged={sliderChanged}
            isSmall={isSmall}
          />
        </div>
      </div>
    </StyledQuestionContainer>
  )
}

const CustomLabelSlider = ({
  sliderValues,
  sliderChanged,
  question,
  isSmall,
}: any) => {
  const { t } = useTranslation()
  const labels = [question.scaleStart, question.scaleEnd].filter((l) => !!l)
  return (
    <div>
      <div>
        <div>{t('answer')}</div>
        <div>
          <div>
            {labels?.map((l: string) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          <div>
            <Slider
              value={sliderValues.customScaleValue || -2}
              motivation={false}
              sliderChanged={sliderChanged}
              isSmall={isSmall}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Question
