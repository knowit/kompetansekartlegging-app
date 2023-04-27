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

type StylingProps = {
  isSmall: boolean
}

const StyledQuestion = styled.div`
  .questionInfo {
    margin-bottom: 10px;
  }

  h2 {
    font-size: 1em;
  }
  h3 {
    font-size: 0.8em;
  }
  margin-top: 5vh;
  .questionTopic {
    display: inline;
  }

  .sliderContainer {
    display: grid;
    ${(props: StylingProps) =>
      props.isSmall
        ? 'grid-template-rows: 1fr 1fr'
        : 'grid-template-columns: 1fr 4fr'};
    flex-wrap: wrap;
    align-items: center;
  }
`

const Question = ({
  questionAnswer,
  setIsCategorySubmitted,
  isSmall,
  alerts,
  sliderValues,
  setSliderValues,
}: QuestionProps) => {
  const question = questionAnswer.question
  const questionId = question.id
  const questionType = question.type || QuestionType.KnowledgeMotivation
  const questionTopic = question.topic
  const questionText = question.text
  const questionSliderValues = sliderValues.get(questionId)

  const sliderChanged = (newValue: number, motivation: boolean) => {
    setIsCategorySubmitted(false)
    if (questionSliderValues) {
      if (questionType === QuestionType.KnowledgeMotivation) {
        const sv = questionSliderValues as SliderKnowledgeMotivationValues
        if (motivation) {
          setSliderValues(questionId, {
            knowledge: sv.knowledge || 0,
            motivation: newValue,
          })
        } else {
          setSliderValues(questionId, {
            knowledge: newValue,
            motivation: sv.motivation || 0,
          })
        }
      } else if (questionType === QuestionType.CustomScaleLabels) {
        setSliderValues(questionId, {
          customScaleValue: newValue,
        })
      }
    }
  }

  const hasAlerts = alerts?.qidMap.has(questionId)
  let alertType = alerts?.qidMap.get(questionId)?.type
  let alertMessage = alerts?.qidMap.get(questionId)?.message
  let badgeContent = <></>
  if (hasAlerts) {
    alertType = alerts?.qidMap.get(questionId)?.type
    alertMessage = alerts?.qidMap.get(questionId)?.message
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
    <StyledQuestion isSmall={isSmall}>
      <div className="questionInfo">
        <h2 className="questionTopic">{questionTopic}</h2>
        {hasAlerts && <Tooltip title={alertMessage}>{badgeContent}</Tooltip>}
        <div>{questionText}</div>
      </div>
      {questionType === QuestionType.KnowledgeMotivation && (
        <KnowledgeMotivationSliders
          sliderValues={questionSliderValues}
          sliderChanged={sliderChanged}
          isSmall={isSmall}
        />
      )}
      {questionType === QuestionType.CustomScaleLabels && (
        <CustomLabelSlider
          question={question}
          sliderValues={questionSliderValues}
          sliderChanged={sliderChanged}
          isSmall={isSmall}
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

  .customLabels {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: end;

    [class*='scale'] {
      max-width: 200px;
      word-wrap: break-word;
    }

    .scaleStart {
      grid-column: 1;
    }
    .scaleMiddle {
      grid-column: 2;
      text-align: center;
      justify-self: center;
    }
    .scaleEnd {
      grid-column: 3;
      text-align: right;
      justify-self: end;
    }
  }
`

const KnowledgeMotivationSliders = ({ sliderValues, sliderChanged }: any) => {
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
  return (
    <StyledQuestionContainer>
      <div>
        <div className="customLabels">
          <div className="scaleStart">{question.scaleStart}</div>
          {!isSmall && (
            <div className="scaleMiddle">{question.scaleMiddle}</div>
          )}
          <div className="scaleEnd">{question.scaleEnd}</div>
        </div>
        <Slider
          value={sliderValues.customScaleValue || -2}
          motivation={false}
          sliderChanged={sliderChanged}
        />
      </div>
    </StyledQuestionContainer>
  )
}

export default Question
