import Slider from '@mui/material/Slider'
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

import { KnowitColors } from '../styles'
import { CustomScaleChartProps } from '../types'
import { useTranslation } from 'react-i18next'

const numTicks = 5
const heightPerColumn = 50

export const CustomScaleChart = ({ ...props }: CustomScaleChartProps) => {
  const { t } = useTranslation()

  if (props.chartData.length === 0) return null

  const RenderCustomTooltip = () => {
    return ({ ...props }: TooltipProps<ValueType, NameType>) => {
      if (props.active && props.payload) {
        const value = props.payload[0]?.payload.value.toFixed(1)
        const marks = new Array(11).fill(undefined).map((_v, i) => {
          return { value: i * 0.5, label: '' }
        })
        marks[0].label = '0'
        marks[5].label = '2.5'
        marks[10].label = '5.0'
        const startLabel = props.payload[0]?.payload.startLabel
        const middleLabel = props.payload[0]?.payload.middleLabel
        const endLabel = props.payload[0]?.payload.endLabel

        return (
          <div>
            <p>{props.label}</p>
            <div>
              <div>
                <span>{startLabel}</span>
                <span>{middleLabel}</span>
                <span>{endLabel}</span>
              </div>
              <Slider
                value={value}
                step={0.125}
                marks={marks}
                min={0}
                max={5}
                disabled
              />
            </div>
            <p>{t('answer') + `: ${value}`}</p>
          </div>
        )
      }
      return null
    }
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
          margin={{ top: 50, right: 50, bottom: 6, left: 50 }}
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
            padding={{ left: 0, right: 20 }}
            domain={[0, numTicks]}
            ticks={[0, 1, 2, 3, 4, 5]}
          />
          <YAxis
            width={200}
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
