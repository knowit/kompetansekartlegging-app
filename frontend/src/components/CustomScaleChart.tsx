import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'

import { KnowitColors } from '../styleconstants'
import { CustomScaleChartProps } from '../types'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'

const StyledTooltip = styled.div`
  .tooltipLabels {
    display: flex;
    justify-content: space-between;
  }
`

const numTicks = 5
const heightPerColumn = 50

export const CustomScaleChart = ({ ...props }: CustomScaleChartProps) => {
  const { t } = useTranslation()

  if (props.chartData.length === 0) return null

  const words = props.chartData.map((cat) => cat.name.split(' ')).flat(1)
  const longest_word_length = Math.max(...words.map((el) => el.length))
  const labelwidth = longest_word_length * 8.5

  const RenderCustomTooltip = () => {
    return ({ ...props }: TooltipProps<ValueType, NameType>) => {
      if (props.active && props.payload) {
        const value = props.payload[0]?.payload.value.toFixed(1)
        return (
          <StyledTooltip>
            <p>{props.label}</p>
            <p>{t('answer') + `: ${value}`}</p>
          </StyledTooltip>
        )
      }
      return null
    }
  }

  const labelObj = props.chartData[0]
  const tickFormatter = (value: any) => {
    switch (value) {
      case 0:
        return labelObj.startLabel || ''
      case 2.5:
        return labelObj.middleLabel || ''
      case 5:
        return labelObj.endLabel || ''
    }
    return ''
  }

  return (
    <div>
      <ResponsiveContainer
        width="100%"
        height={heightPerColumn * props.chartData.length + 90}
      >
        <BarChart
          barGap={-15}
          barSize={15}
          maxBarSize={15}
          layout="vertical"
          data={props.chartData}
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
            domain={[0, numTicks]}
            ticks={[0, 2.5, 5]}
            tickFormatter={tickFormatter}
          />
          <YAxis
            width={labelwidth}
            dataKey="name"
            type="category"
            interval={0}
            tick={{ fill: KnowitColors.darkBrown }}
          />
          <Tooltip
            wrapperStyle={{ outline: 'none' }}
            content={RenderCustomTooltip()}
            cursor={{ fill: KnowitColors.ecaluptus, opacity: 0.3 }}
          />
          <Bar
            radius={[0, 10, 10, 0]}
            dataKey="value"
            fill={KnowitColors.darkGreen}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
