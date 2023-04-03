import { Button } from '@mui/material'

import { useEffect } from 'react'
import { KnowitColors } from '../styles'
import { Panel, YourAnswerProps } from '../types'
import { AlertNotification, AlertType } from './AlertNotification'
import AnswerDiagram from './AnswerDiagram'
import { BlockInfo } from './BlockInfo'
import { useTranslation } from 'react-i18next'
import { MenuButton } from './Content'
import { Form } from './Form'
import ProgressBar from './ProgressBar'

export const YourAnswersMobile = ({ ...props }: YourAnswerProps) => {
  const { t } = useTranslation()

  const getCategoryButtons = () => {
    const buttons: JSX.Element[] = []

    const categories = props.categories.map((cat) => {
      return {
        text: cat,
        buttonType: MenuButton.Category,
        activePanel: Panel.MyAnswers,
      }
    })

    categories.forEach((category, index) => {
      buttons.push(
        <Button
          key={category.text}
          onClick={() => {
            props.checkIfCategoryIsSubmitted(category.buttonType, category.text)
          }}
        >
          <div>
            {index + 1}. {category.text}
          </div>
          {props.alerts?.categoryMap.has(category.text) ? (
            <AlertNotification
              type={AlertType.Multiple}
              message={t('content.unansweredOrOutdatedQuestionsInCategory')}
              size={props.alerts.categoryMap.get(category.text)}
            />
          ) : (
            ''
          )}
        </Button>
      )
    })
    return buttons
  }

  const getCategoryButtonsCollapsed = () => {
    const buttons: JSX.Element[] = []

    const categories = props.categories.map((cat) => {
      return {
        text: cat,
        buttonType: MenuButton.Category,
        activePanel: Panel.MyAnswers,
      }
    })

    categories.forEach((category, index) => {
      if (category.text === props.activeCategory) {
        buttons.push(
          <Button
            key={category.text}
            onClick={() => {
              props.checkIfCategoryIsSubmitted(
                category.buttonType,
                category.text
              )
            }}
          >
            <div>
              {index + 1}. {category.text}
            </div>
            {props.alerts?.categoryMap.has(category.text) ? (
              <AlertNotification
                type={AlertType.Multiple}
                message={t('content.unansweredOrOutdatedQuestionsInCategory')}
                size={props.alerts.categoryMap.get(category.text)}
              />
            ) : (
              ''
            )}
          </Button>
        )
      }
    })
    return buttons
  }

  const getCategoryDescription = (): string => {
    const categoryDesc = props.formDefinition?.questions.items.find(
      (q) => q.category.text === props.activeCategory
    )
    return categoryDesc?.category.description ?? ''
  }

  const { setCollapseMobileCategories } = props
  useEffect(() => {
    setCollapseMobileCategories(false)
  }, [setCollapseMobileCategories])

  return (
    <div>
      <div ref={props.categoryNavRef}>
        <div>
          <div>{getCategoryButtons()}</div>
        </div>
      </div>
      <div>
        <div>
          <div>{getCategoryButtonsCollapsed()}</div>
        </div>
        <div>
          <div>
            <ProgressBar
              alerts={props.alerts}
              totalQuestions={props.formDefinition?.questions.items.length ?? 0}
            />
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <BlockInfo
              questions={props.questionAnswers.get(props.activeCategory)}
            />
            <Button onClick={() => props.enableAnswerEditMode()}>
              {t('myAnswers.changeAnswers')}
            </Button>
            {/* <div  >{props.activeCategory}</div> */}
          </div>
          <div>
            <AnswerDiagram
              questionAnswers={props.questionAnswers}
              activeCategory={props.activeCategory}
              isMobile={true}
            />
          </div>
        </div>
        <div>
          <div>
            <ProgressBar
              alerts={props.alerts}
              totalQuestions={props.formDefinition?.questions.items.length ?? 0}
            />
          </div>
          <div>{getCategoryDescription()}</div>
          <Form
            {...props}
            isMobile={true}
            alerts={props.alerts}
            scrollToTop={props.scrollToTop}
          />
        </div>
      </div>
    </div>
  )
}
