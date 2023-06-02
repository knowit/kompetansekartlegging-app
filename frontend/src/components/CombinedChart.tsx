import { useTranslation } from 'react-i18next'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
} from 'recharts'
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'
import { GetIcon } from '../icons/iconController'
import { KnowitColors } from '../styleconstants'
import { CombinedChartProps } from '../types'
import { OverviewType } from './TypedOverviewChart'

const numTicks = 5
const chartSplitAt = numTicks + 2
const heightPerColumn = 50

const getLabel = (
  isTop: any,
  topGetFn: () => any,
  defaultValue: string
): string => {
  if (isTop) {
    return topGetFn()
  }

  return defaultValue
}

export const CombinedChart = ({
  chartData,
  type,
  topSubjects,
}: CombinedChartProps) => {
  const { t } = useTranslation()

  if (chartData.length === 0) return null

  const RenderCustomTooltip = () => {
    const validate = (msg: string | undefined) => {
      if (msg === '') return t('notAnswered')
      else return msg
    }
    const isTop = type === OverviewType.HIGHEST && topSubjects
    return ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
      if (active && payload) {
        const knowledgeValue = payload[0]?.payload.valueKnowledge[1].toFixed(1)
        const motivationValue = (
          payload[1]?.payload.valueMotivation[1] - chartSplitAt
        ).toFixed(1)
        const knowledgeLabel = getLabel(
          isTop,
          () => validate(topSubjects?.get(label)?.kTop),
          t('competence')
        )
        const motivationLabel = getLabel(
          isTop,
          () => validate(topSubjects?.get(label)?.mTop),
          t('motivation')
        )

        return (
          <div>
            <p>{label}</p>
            <p>
              {knowledgeLabel}: {knowledgeValue}
            </p>
            <p>
              {motivationLabel}: {motivationValue}
            </p>
          </div>
        )
      }
      return null
    }
  }

  const words = chartData.map((cat) => cat.name.split(' ')).flat(1)
  const longest_word_length = Math.max(...words.map((el) => el.length))
  const labelwidth = longest_word_length * 8.5

  return (
    <ResponsiveContainer
      width="100%"
      height={heightPerColumn * chartData.length + 90}
    >
      <BarChart
        barGap={-15}
        barSize={15}
        maxBarSize={15}
        layout="vertical"
        data={chartData}
        margin={{ top: 50, right: 10, left: labelwidth }}
      >
        <CartesianGrid
          horizontal={true}
          vertical={true}
          strokeDasharray="2 5"
        />
        <XAxis
          tickLine={false}
          axisLine={false}
          orientation="top"
          dataKey="value"
          type="number"
          ticks={[0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12]}
          tick={renderCustomAxisTicks()}
        />
        <YAxis
          dataKey="name"
          type="category"
          interval={0}
          tick={{ fill: KnowitColors.darkBrown }}
          width={labelwidth}
        />
        <Tooltip
          wrapperStyle={{ outline: 'none' }}
          content={RenderCustomTooltip()}
          cursor={{ fill: KnowitColors.ecaluptus, opacity: 0.3 }}
        />
        <Bar
          radius={[0, 10, 10, 0]}
          dataKey="valueKnowledge"
          fill={KnowitColors.darkGreen}
        />
        <Bar
          radius={[0, 10, 10, 0]}
          dataKey="valueMotivation"
          fill={KnowitColors.lightGreen}
        />
        <ReferenceLine x={0} stroke={KnowitColors.darkGreen}>
          <Label position="top" offset={50}>
            {t('competence')}
          </Label>
        </ReferenceLine>
        <ReferenceLine x={chartSplitAt} stroke={KnowitColors.darkGreen}>
          <Label position="top" offset={50}>
            {t('motivation')}
          </Label>
        </ReferenceLine>
      </BarChart>
    </ResponsiveContainer>
  )
}

const renderCustomAxisTicks = () => {
  return ({ payload, x, y }: TickProps) => {
    let isKnowledge = true
    let iconNumber = payload.value
    if (payload.value >= chartSplitAt) {
      iconNumber -= chartSplitAt
      isKnowledge = false
    }
    return (
      <foreignObject x={x - 12} y={y - 24} width={24} height={24}>
        {GetIcon(isKnowledge, Math.round(iconNumber))};
      </foreignObject>
    )
  }
}

type TickProps = {
  knowledge: boolean
  x: number
  y: number
  payload: {
    value: any
  }
}
