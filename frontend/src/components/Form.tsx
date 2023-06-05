import { Button } from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Fragment, useRef } from 'react'
import { QuestionType as QuestionTypeT } from '../API'
import { FormProps, SliderValues } from '../types'
import Question from './Question'
import { useTranslation } from 'react-i18next'

export const Form = ({
  createUserForm,
  submitAndProceed,
  updateAnswer,
  formDefinition,
  questionAnswers,
  categories,
  activeCategory,
  setIsCategorySubmitted,
  isSmall,
  alerts,
  scrollToTop,
}: FormProps) => {
  const { t } = useTranslation()
  const sliderValues = useRef<Map<string, SliderValues>>(new Map()) //String is questionid, values are knowledge and motivation

  const setSliderValues = (questionId: string, values: SliderValues) => {
    sliderValues.current.set(questionId, values)
    updateAnswer(activeCategory, sliderValues.current)
  }

  const getQuestionsForCategory = (): JSX.Element[] => {
    const questionAnswersForCat =
      questionAnswers?.get(activeCategory)?.map((questionAnswer) => {
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
            updateAnswer={updateAnswer}
            setIsCategorySubmitted={setIsCategorySubmitted}
            isSmall={isSmall}
            alerts={alerts}
            sliderValues={sliderValues.current}
            setSliderValues={setSliderValues}
          />
        )
      }) || []
    return questionAnswersForCat
  }

  const handleClickSubmit = async () => {
    updateAnswer(activeCategory, sliderValues.current)
    createUserForm()
    scrollToTop()
  }

  const handleClickProceed = async () => {
    updateAnswer(activeCategory, sliderValues.current)
    submitAndProceed()
    scrollToTop()
  }

  const createQuestionCategory = (): JSX.Element => {
    if (!formDefinition) return <Fragment />
    return (
      <Fragment>
        {getQuestionsForCategory()}
        <div>
          {categories.length > 0 ? (
            <Button onClick={handleClickSubmit}>
              {t('myAnswers.submitAnswersAndQuit')}
            </Button>
          ) : (
            ''
          )}
          {categories.findIndex((cat) => cat === activeCategory) !==
          categories.length - 1 ? (
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
