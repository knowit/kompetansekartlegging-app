import Button from '@mui/material/Button'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { roundDecimals } from '../helperFunctions'
import { ChartData, ResultData, ResultDiagramProps } from '../types'
import { CombinedChart } from './CombinedChart'
import { CombinedChartSmall } from './CombinedChartSmall'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

const StyledOverviewContainer = styled.div`
  #buttonContainer {
    display: flex;
    justify-content: center;
    width: 100%;
  }
`

export enum OverviewType {
  AVERAGE,
  MEDIAN,
  HIGHEST,
}

const recalculate = (
  currentType: OverviewType,
  createAverageData: () => ResultData[],
  createMedianData: () => ResultData[],
  createHighestData: () => ResultData[],
  setChartData: Dispatch<SetStateAction<ChartData[]>>,
  isSmall: boolean
) => {
  let answerData: ResultData[] = []
  switch (currentType) {
    case OverviewType.AVERAGE:
      answerData = createAverageData()
      break
    case OverviewType.MEDIAN:
      answerData = createMedianData()
      break
    case OverviewType.HIGHEST:
      answerData = createHighestData()
  }
  const knowledgeStart = isSmall ? 7 : 0
  const motivationStart = isSmall ? 0 : 7
  const data: ChartData[] = answerData.map((answer) => {
    if (answer.aggCustomScale > 0) {
      return {
        name: answer.category,
        valueKnowledge: [
          knowledgeStart,
          knowledgeStart +
            (answer.aggCustomScale === -1 ? 0 : answer.aggCustomScale),
        ],
        valueMotivation: [
          motivationStart,
          motivationStart +
            (answer.aggCustomScale === -1 ? 0 : answer.aggCustomScale),
        ],
      }
    }

    return {
      name: answer.category,
      valueKnowledge: [
        knowledgeStart,
        knowledgeStart + (answer.aggKnowledge === -1 ? 0 : answer.aggKnowledge),
      ],
      valueMotivation: [
        motivationStart,
        motivationStart +
          (answer.aggMotivation === -1 ? 0 : answer.aggMotivation),
      ],
    }
  })
  setChartData(data)
}

export default function TypedOverviewChart({
  questionAnswers,
  categories,
  isSmall,
}: ResultDiagramProps) {
  const { t } = useTranslation()

  const [chartData, setChartData] = useState<ChartData[]>([])
  const [currentType, setOverviewType] = useState<OverviewType>(
    OverviewType.HIGHEST
  )
  const [topSubjects, setTopSubjects] = useState<
    Map<string, { kTop: string; mTop: string }>
  >(new Map())

  type ReduceValue = {
    knowledgeCount: number
    knowledgeAverage: number
    knowledgeTotal: number
    motivationCount: number
    motivationAverage: number
    motivationTotal: number
    customScaleCount: number
    customScaleAverage: number
    customScaleTotal: number
  }

  useEffect(() => {
    const createAverageData = (): ResultData[] => {
      //data: ResultData[]
      const ansData: ResultData[] = []
      questionAnswers.forEach((questionAnswers, category) => {
        const reduced = questionAnswers.reduce<ReduceValue>(
          (acc, cur): ReduceValue => {
            if (cur.customScaleValue && cur.customScaleValue >= 0) {
              acc.customScaleCount = acc.customScaleCount + 1
              acc.customScaleTotal = acc.customScaleTotal + cur.customScaleValue
              acc.customScaleAverage =
                acc.customScaleTotal / acc.customScaleCount
            }

            if (cur.knowledge >= 0) {
              acc.knowledgeCount = acc.knowledgeCount + 1
              acc.knowledgeTotal = acc.knowledgeTotal + cur.knowledge
              acc.knowledgeAverage = acc.knowledgeTotal / acc.knowledgeCount
            }
            if (cur.motivation >= 0) {
              acc.motivationCount = acc.motivationCount + 1
              acc.motivationTotal = acc.motivationTotal + cur.motivation
              acc.motivationAverage = acc.motivationTotal / acc.motivationCount
            }
            return acc
          },
          {
            knowledgeCount: 0,
            knowledgeAverage: 0,
            knowledgeTotal: 0,
            motivationCount: 0,
            motivationAverage: 0,
            motivationTotal: 0,
            customScaleCount: 0,
            customScaleAverage: 0,
            customScaleTotal: 0,
          }
        )
        ansData.push({
          category: category,
          aggKnowledge: roundDecimals(reduced.knowledgeAverage, 1),
          aggMotivation: roundDecimals(reduced.motivationAverage, 1),
          aggCustomScale: roundDecimals(reduced.customScaleAverage, 1),
        })
      })
      return ansData
    }

    const createMedianData = (): ResultData[] => {
      const ansData: ResultData[] = []
      const getMedian = (numbers: number[]): number => {
        const mid = Math.floor(numbers.length / 2)
        numbers.sort()
        return numbers.length % 2 === 1
          ? numbers[mid]
          : (numbers[mid - 1] + numbers[mid]) / 2
      }
      questionAnswers.forEach((questionAnswers, category) => {
        if (questionAnswers.length > 0) {
          const medianKnowledge = getMedian(
            questionAnswers.map((qa) => qa.knowledge).filter((n) => n >= 0)
          )
          const medianMotivation = getMedian(
            questionAnswers.map((qa) => qa.motivation).filter((n) => n >= 0)
          )
          const medianCustomScale = getMedian(
            questionAnswers
              .map((qa) => qa.customScaleValue)
              .filter((n) => n >= 0)
          )
          ansData.push({
            category: category,
            aggKnowledge: medianKnowledge ? medianKnowledge : 0,
            aggMotivation: medianMotivation ? medianMotivation : 0,
            aggCustomScale: medianCustomScale ? medianCustomScale : 0,
          })
        } else {
          ansData.push({
            category: category,
            aggKnowledge: 0,
            aggMotivation: 0,
            aggCustomScale: 0,
          })
        }
      })
      return ansData
    }

    const createHighestData = (): ResultData[] => {
      const ansData: ResultData[] = []
      const newTopSubjects: Map<string, { kTop: string; mTop: string }> =
        new Map()
      questionAnswers.forEach((questionAnswers, category) => {
        let kTop = ''
        let mTop = ''
        const reduced = questionAnswers.reduce<{
          maxKnowledge: number
          maxMotivation: number
          maxCustomScale: number
        }>(
          (
            acc,
            cur
          ): {
            maxKnowledge: number
            maxMotivation: number
            maxCustomScale: number
          } => {
            if (acc.maxKnowledge < cur.knowledge) {
              acc.maxKnowledge = cur.knowledge
              kTop = cur.question.topic
            }
            if (acc.maxMotivation < cur.motivation) {
              acc.maxMotivation = cur.motivation
              mTop = cur.question.topic
            }
            if (acc.maxCustomScale < cur.customScaleValue) {
              acc.maxCustomScale = cur.customScaleValue
              mTop = cur.question.topic
            }
            return acc
          },
          {
            maxKnowledge: -1,
            maxMotivation: -1,
            maxCustomScale: -1,
          }
        )
        ansData.push({
          category: category,
          aggKnowledge: reduced.maxKnowledge,
          aggMotivation: reduced.maxMotivation,
          aggCustomScale: reduced.maxCustomScale,
        })
        newTopSubjects.set(category, { kTop: kTop, mTop: mTop })
      })
      setTopSubjects(newTopSubjects)
      return ansData
    }
    recalculate(
      currentType,
      createAverageData,
      createMedianData,
      createHighestData,
      setChartData,
      isSmall
    )
  }, [isSmall, questionAnswers, currentType, setChartData])

  const cycleChartType = () => {
    switch (currentType) {
      case OverviewType.AVERAGE:
        setOverviewType(OverviewType.HIGHEST)
        break
      case OverviewType.HIGHEST:
        setOverviewType(OverviewType.MEDIAN)
        break
      case OverviewType.MEDIAN:
        setOverviewType(OverviewType.AVERAGE)
    }
  }

  const selectChartType = (
    event: React.MouseEvent<HTMLElement>,
    type: OverviewType
  ) => {
    // returns null if same clicked twice
    if (type !== null) {
      setOverviewType(type)
    }
  }

  const translateOverviewType = (type: OverviewType) => {
    switch (type) {
      case OverviewType.AVERAGE:
        return t('overview.overviewType.average')
      case OverviewType.MEDIAN:
        return t('overview.overviewType.median')
      case OverviewType.HIGHEST:
        return t('overview.overviewType.highest')
    }
  }

  const getButton = (type: OverviewType): JSX.Element => {
    return (
      <ToggleButton value={type}>{translateOverviewType(type)}</ToggleButton>
    )
  }

  return (
    <StyledOverviewContainer>
      <div id="buttonContainer">
        {isSmall ? (
          <Button variant="contained" onClick={() => cycleChartType()}>
            {translateOverviewType(currentType)}
          </Button>
        ) : (
          <ToggleButtonGroup
            value={currentType}
            exclusive={true}
            onChange={selectChartType}
          >
            {getButton(OverviewType.HIGHEST)}
            {getButton(OverviewType.AVERAGE)}
            {getButton(OverviewType.MEDIAN)}
          </ToggleButtonGroup>
        )}
      </div>
      <div>
        {isSmall ? (
          <CombinedChartSmall
            chartData={chartData}
            type={currentType}
            topSubjects={topSubjects}
          />
        ) : (
          <CombinedChart
            chartData={chartData}
            type={currentType}
            topSubjects={topSubjects}
          />
        )}
      </div>
    </StyledOverviewContainer>
  )
}
