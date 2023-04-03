import { Button } from '@mui/material'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Fragment, useRef } from 'react'
import { QuestionType as QuestionTypeT } from '../API'
import { FormProps, SliderValues } from '../types'
import Question from './Question'
import { useTranslation } from 'react-i18next'

type QuestionType = {
  id: string
  text: string
  topic: string
  category: {
    text: string
  }
}

export const Form = ({ ...props }: FormProps) => {
  const { t } = useTranslation()
  const sliderValues = useRef<Map<string, SliderValues>>(new Map()) //String is questionid, values are knowledge and motivation

  const setSliderValues = (questionId: string, values: SliderValues) => {
    sliderValues.current.set(questionId, values)
    props.updateAnswer(props.activeCategory, sliderValues.current)
  }

  const getQuestionsForCategory = (
    _items: QuestionType[] | undefined
  ): JSX.Element[] => {
    //console.log("Props to make questions from: ", props.questionAnswers);
    const questionAnswers =
      props.questionAnswers
        ?.get(props.activeCategory)
        ?.map((questionAnswer) => {
          const question = questionAnswer.question
          // great stuff guys; don't ever see this getting back at us
          if (question.type === QuestionTypeT.CustomScaleLabels) {
            sliderValues.current.set(question.id, {
              customScaleValue: questionAnswer.customScaleValue,
            })
          } else {
            sliderValues.current.set(question.id, {
              knowledge: questionAnswer.knowledge,
              motivation: questionAnswer.motivation,
            })
          }
          return (
            <Question
              key={question.id}
              questionAnswer={questionAnswer}
              updateAnswer={props.updateAnswer}
              knowledgeDefaultValue={questionAnswer.knowledge}
              motivationDefaultValue={questionAnswer.motivation}
              setIsCategorySubmitted={props.setIsCategorySubmitted}
              isMobile={props.isMobile}
              alerts={props.alerts}
              sliderValues={sliderValues.current}
              setSliderValues={setSliderValues}
            />
          )
        }) || []
    //console.log("Form question answers:", questionAnswers);
    return questionAnswers
  }

  const handleClickSubmit = async () => {
    props.updateAnswer(props.activeCategory, sliderValues.current)
    props.createUserForm()
    props.scrollToTop()
  }

  const handleClickProceed = async () => {
    props.updateAnswer(props.activeCategory, sliderValues.current)
    props.submitAndProceed()
    props.scrollToTop()
  }

  const createQuestionCategory = (): JSX.Element => {
    if (!props.formDefinition) return <Fragment />
    return (
      <Fragment>
        {getQuestionsForCategory(undefined)}
        <div>
          {props.categories.length > 0 ? (
            <Button onClick={handleClickSubmit}>
              {t('myAnswers.submitAnswersAndQuit')}
            </Button>
          ) : (
            ''
          )}
          {props.categories.findIndex((cat) => cat === props.activeCategory) !==
          props.categories.length - 1 ? (
            <Button onClick={handleClickProceed}>
              {t('myAnswers.saveAndContinue')}
              <ArrowForwardRoundedIcon />
            </Button>
          ) : (
            ''
          )}
        </div>
      </Fragment>
    )
  }

  return <div>{createQuestionCategory()}</div>
}
