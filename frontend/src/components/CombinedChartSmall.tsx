import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { GetIcon } from '../icons/iconController'
import { KnowitColors } from '../styleconstants'
import { ChartData, CombinedChartProps } from '../types'
import { wrapString } from '../helperFunctions'
import { OverviewType } from './TypedOverviewChart'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions } from '../helperFunctions'

const numTicks = 5
const chartSplitAt = numTicks + 2
const iconSize = 18

const getMaxColumnsForWidth = (width: number) => {
  const scalingFactor = 50
  return Math.floor(width / scalingFactor)
}

const createPagedData = (
  chartData: ChartData[],
  maxColumnsPerPage: number
): ChartData[][] => {
  const pagedData: ChartData[][] = []
  let items = chartData.length
  let balancedColumnsPerPage
  if (items > maxColumnsPerPage) {
    const numPages = Math.ceil(items / maxColumnsPerPage)
    balancedColumnsPerPage = Math.ceil(items / numPages)
  } else {
    balancedColumnsPerPage = maxColumnsPerPage
  }
  let i = 0
  while (items > 0) {
    pagedData.push(chartData.slice(i, i + balancedColumnsPerPage))
    i += balancedColumnsPerPage
    items -= balancedColumnsPerPage
  }
  return pagedData
}

export const CombinedChartSmall = ({
  chartData,
  type,
}: CombinedChartProps): JSX.Element => {
  const { t } = useTranslation()

  const [chartPages, setChartPages] = useState<ChartData[][]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [currentType, setCurrentType] = useState<OverviewType>()

  const { width } = useWindowDimensions()
  const maxColumnsPerPage = getMaxColumnsForWidth(width)

  useEffect(() => {
    if (currentType !== type) {
      // New data and type has changed
      if (typeof currentType === 'undefined') {
        setCurrentType(type)
        setCurrentPage(0)
      } else {
        if (typeof type === 'undefined') {
          setCurrentType(type)
          setCurrentPage(0)
        } else {
          // Previous type was defined, now new type: RETAIN PAGE
          setCurrentType(type)
        }
      }
    } else {
      // New data and type has NOT changed
      setCurrentPage(0)
    }
    setChartPages(createPagedData(chartData, maxColumnsPerPage))
  }, [chartData, currentType, type, maxColumnsPerPage])

  useEffect(() => {
    setChartPages(createPagedData(chartData, maxColumnsPerPage))
    setCurrentPage(0)
  }, [chartData, maxColumnsPerPage])

  const createPager = (): JSX.Element => {
    return (
      <div>
        {chartPages.map((_, index) =>
          index === currentPage ? <div key={index} /> : <div key={index} />
        )}
      </div>
    )
  }

  const handleChangePageClick = () => {
    changePageRight()
  }

  const changePageRight = () => {
    if (currentPage === chartPages.length - 1) {
      setCurrentPage(0)
    } else {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ResponsiveContainer>
        <BarChart
          barGap={-10}
          barSize={10}
          maxBarSize={10}
          layout="horizontal"
          data={chartPages[currentPage]}
          margin={{ top: 50, right: 20, bottom: 10, left: -30 }}
        >
          <CartesianGrid horizontal={true} strokeDasharray="2 5" />
          <YAxis
            axisLine={false}
            dataKey="value"
            type="number"
            padding={{ top: 20, bottom: 20 }}
            domain={[0, chartSplitAt + numTicks]}
            ticks={[0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12]}
            tickLine={false}
            tick={renderCustomAxisTicks()}
            minTickGap={-5}
          />
          <XAxis
            orientation="top"
            axisLine={false}
            dataKey="name"
            type="category"
            domain={[]}
            interval={0}
            tickLine={false}
            tick={renderLabelTick}
          />
          <Bar
            radius={[10, 10, 0, 0]}
            dataKey="valueKnowledge"
            fill={KnowitColors.darkGreen}
          />
          <Bar
            radius={[10, 10, 0, 0]}
            dataKey="valueMotivation"
            fill={KnowitColors.lightGreen}
          />
          <ReferenceLine y={0} stroke={KnowitColors.darkGreen}>
            <Label
              position="insideTopRight"
              fontSize={12}
              fontWeight="bold"
              fill={KnowitColors.darkBrown}
            >
              {t('motivation')}
            </Label>
          </ReferenceLine>
          <ReferenceLine y={chartSplitAt} stroke={KnowitColors.darkGreen}>
            <Label
              position="insideTopRight"
              fontSize={12}
              fontWeight="bold"
              fill={KnowitColors.darkBrown}
            >
              {t('competence')}
            </Label>
          </ReferenceLine>
        </BarChart>
      </ResponsiveContainer>
      {maxColumnsPerPage < chartData.length ? (
        <div onClick={handleChangePageClick}>{createPager()}</div>
      ) : (
        ''
      )}
    </div>
  )
}

const renderCustomAxisTicks = () => {
  return ({ payload, x, y }: TickProps) => {
    let isKnowledge = false
    let iconNumber = payload.value
    if (payload.value >= chartSplitAt) {
      iconNumber -= chartSplitAt
      isKnowledge = true
    }
    return (
      <svg
        x={x - iconSize}
        y={y - iconSize / 2}
        width={iconSize}
        height={iconSize}
        fill="black"
      >
        {GetIcon(isKnowledge, Math.round(iconNumber))};
      </svg>
    )
  }
}

const renderLabelTick = ({ payload, index, x, y }: TickLabelProps) => {
  const dy = index % 2 ? '-1em' : '-6em'
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={dy}
        textAnchor="middle"
        fontSize={10}
        fontWeight="bold"
        fill={KnowitColors.darkGreen}
      >
        {wrapString(payload.value, 15).map((s: string, index: number) => (
          <tspan key={index} x="0" dy="1em">
            {s}
          </tspan>
        ))}
      </text>
    </g>
  )
}

type TickProps = {
  knowledge: boolean
  x: number
  y: number
  payload: {
    value: any
  }
}

type TickLabelProps = {
  x: number
  y: number
  index: number
  visibleTicksCount: number
  payload: {
    value: any
  }
}
