import { makeStyles } from '@material-ui/core'
import React from 'react'
import {
  AnswerDiagramProps,
  CustomScaleLabelsChartData,
  ChartData,
} from '../types'
import { CustomScaleChart } from './CustomScaleChart'
import { CombinedChart } from './CombinedChart'
import { CombinedChartMobile } from './CombinedChartMobile'
import { QuestionAnswer } from '../api/questionAnswers/types'
import { QuestionType } from '../api/questions/types'
import { getQuestionById, getQuestionsByCategory } from '../api/questions'

const answerDiagramStyle = makeStyles({
  answerDiagramContainer: {
    paddingBottom: 50,
  },
})

interface Scores {
  valueKnowledge: number[]
  valueMotivation: number[]
}

const scores = (
  quAns: QuestionAnswer,
  knowledgeStart: number,
  motivationStart: number
): Scores => {
  return {
    valueKnowledge: [
      knowledgeStart,
      knowledgeStart + (quAns.knowledge == null ? 0 : quAns.knowledge),
    ],
    valueMotivation: [
      motivationStart,
      motivationStart + (quAns.motivation == null ? 0 : quAns.motivation),
    ],
  }
}

interface CustomScaleLabelsScores {
  value: number
}

const scoresCustomScaleLabels = (
  quAns: QuestionAnswer
): CustomScaleLabelsScores => {
  return {
    value: quAns.custom_scale_value == null ? 0 : quAns.custom_scale_value,
  }
}

export default function AnswerDiagram({ ...props }: AnswerDiagramProps) {
  const styles = answerDiagramStyle()

  const activeCategory = props.activeCategory
  const questionAnswers = props.questionAnswers.get(activeCategory)
  getQuestionsByCategory(activeCategory)
  const knowledgeMotivationQuAns = questionAnswers?.filter(async (quAns) => {
    const question = await getQuestionById(quAns.question_id).then(
      (a) => a.data
    )
    if (!question) {
      return null
    }
    return (
      question.type === null ||
      question.type === QuestionType.knowledge_motivation
    )
  })
  const customScaleLabelsQuAns = questionAnswers?.filter(
    (quAns) => quAns.question.type === QuestionType.custom_scale_label
  )

  const knowledgeStart = props.isMobile ? 7 : 0
  const motivationStart = props.isMobile ? 0 : 7
  const knowledgeMotivationChartData: ChartData[] =
    knowledgeMotivationQuAns?.map((quAns) => {
      return {
        name: quAns.question.topic,
        ...scores(quAns, knowledgeStart, motivationStart),
      }
    }) || []

  const customScaleLabelsChartData: CustomScaleLabelsChartData[] =
    customScaleLabelsQuAns?.map((quAns) => {
      return {
        startLabel: quAns.question.scaleStart,
        middleLabel: quAns.question.scaleMiddle,
        endLabel: quAns.question.scaleEnd,
        name: quAns.question.topic,
        ...scoresCustomScaleLabels(quAns),
      }
    }) || []

  return props.isMobile ? (
    <CombinedChartMobile chartData={knowledgeMotivationChartData} />
  ) : (
    <div className={styles.answerDiagramContainer}>
      <CombinedChart chartData={knowledgeMotivationChartData} />
      <CustomScaleChart chartData={customScaleLabelsChartData} />
    </div>
  )
}
