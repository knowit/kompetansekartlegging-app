import { QuestionType } from '../API'
import {
  AnswerDiagramProps,
  CustomScaleLabelsChartData,
  ChartData,
  QuestionAnswer,
} from '../types'
import { CustomScaleChart } from './CustomScaleChart'
import { CombinedChart } from './CombinedChart'
import { CombinedChartSmall } from './CombinedChartSmall'

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
      knowledgeStart + (quAns.knowledge === -1 ? 0 : quAns.knowledge),
    ],
    valueMotivation: [
      motivationStart,
      motivationStart + (quAns.motivation === -1 ? 0 : quAns.motivation),
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
    value: quAns.customScaleValue === -1 ? 0 : quAns.customScaleValue,
  }
}

export default function AnswerDiagram({
  questionAnswers,
  activeCategory,
  isSmall,
}: AnswerDiagramProps) {
  const questionAnswersForCat = questionAnswers.get(activeCategory)
  const knowledgeMotivationQuAns = questionAnswersForCat?.filter(
    (quAns) =>
      quAns.question.type === null ||
      quAns.question.type === QuestionType.KnowledgeMotivation
  )
  const customScaleLabelsQuAns = questionAnswersForCat?.filter(
    (quAns) => quAns.question.type === QuestionType.CustomScaleLabels
  )

  const knowledgeStart = isSmall ? 7 : 0
  const motivationStart = isSmall ? 0 : 7
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

  return isSmall ? (
    <CombinedChartSmall chartData={knowledgeMotivationChartData} />
  ) : (
    <div>
      <CombinedChart chartData={knowledgeMotivationChartData} />
      <CustomScaleChart chartData={customScaleLabelsChartData} />
    </div>
  )
}
