import React from 'react'
import clsx from 'clsx'
import { QuestionType } from '../API'
import { QuestionProps, SliderKnowledgeMotivationValues } from '../types'
import Slider from './Slider'
import { KnowitColors } from '../styles'
import * as Icon from '../icons/iconController'
import { AlertNotification } from './AlertNotification'
import { useTranslation } from 'react-i18next'

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

  return (
    <div>
      <div>
        <div>{questionTopic}</div>
        {props.alerts?.qidMap.has(questionId) && (
          <AlertNotification
            /* eslint-disable @typescript-eslint/no-non-null-assertion */
            type={props.alerts?.qidMap.get(questionId)!.type}
            message={props.alerts?.qidMap.get(questionId)!.message}
            /* eslint-enable @typescript-eslint/no-non-null-assertion */
          />
        )}
      </div>
      {questionType === QuestionType.KnowledgeMotivation && (
        <KnowledgeMotivationSliders
          sliderValues={sliderValues}
          sliderChanged={sliderChanged}
          isMobile={props.isMobile}
        />
      )}
      {questionType === QuestionType.CustomScaleLabels && (
        <CustomLabelSlider
          question={question}
          sliderValues={sliderValues}
          sliderChanged={sliderChanged}
          isMobile={props.isMobile}
        />
      )}
      <div>{questionText}</div>
    </div>
  )
}

const KnowledgeMotivationSliders = ({
  style,
  sliderValues,
  sliderChanged,
  isMobile,
}: any) => {
  const { t } = useTranslation()

  return (
    <div className={style.answerArea}>
      <div className={clsx(style.largeBold)}>
        {t('competence').toUpperCase()}
      </div>
      <div className={style.sliderArea}>
        <div className={style.iconArea}>{Icon.GetIcons(true, style.icon)}</div>
        <div className={style.slider}>
          <Slider
            value={sliderValues?.knowledge || -2}
            motivation={false}
            sliderChanged={sliderChanged}
            isMobile={isMobile}
          />
        </div>
      </div>
      <div className={clsx(style.largeBold)}>
        {t('motivation').toUpperCase()}
      </div>
      <div className={style.sliderArea}>
        <div className={style.iconArea}>{Icon.GetIcons(false, style.icon)}</div>
        <div className={style.slider}>
          <Slider
            value={sliderValues?.motivation || -2}
            motivation={true}
            sliderChanged={sliderChanged}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  )
}

const CustomLabelSlider = ({
  style,
  sliderValues,
  sliderChanged,
  question,
  isMobile,
}: any) => {
  const { t } = useTranslation()
  const labels = [question.scaleStart, question.scaleEnd].filter((l) => !!l)
  return (
    <div>
      <div className={style.answerArea}>
        <div className={clsx(style.largeBold)}>{t('answer').toUpperCase()}</div>
        <div className={style.sliderArea}>
          <div className={style.iconArea}>
            {labels?.map((l: string) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          <div className={style.slider}>
            <Slider
              value={sliderValues.customScaleValue || -2}
              motivation={false}
              sliderChanged={sliderChanged}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Question
