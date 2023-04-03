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
import { KnowitColors } from '../styles'
import { ChartData, CombinedChartProps } from '../types'
import { wrapString } from '../helperFunctions'
import { useSwipeable } from 'react-swipeable'
import { OverviewType } from './TypedOverviewChart'
import { useTranslation } from 'react-i18next'

const numTicks = 5
const chartSplitAt = numTicks + 2
const iconSize = 18

const getMaxColumnsForWidth = () => {
  const scalingFactor = 50
  const width = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  )
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

export const CombinedChartMobile = ({
  ...props
}: CombinedChartProps): JSX.Element => {
  const { t } = useTranslation()

  const [chartPages, setChartPages] = useState<ChartData[][]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [currentType, setCurrentType] = useState<OverviewType>()

  const maxColumnsPerPage = getMaxColumnsForWidth()

  useEffect(() => {
    if (currentType !== props.type) {
      // New data and type has changed
      if (typeof currentType === 'undefined') {
        setCurrentType(props.type)
        setCurrentPage(0)
      } else {
        if (typeof props.type === 'undefined') {
          setCurrentType(props.type)
          setCurrentPage(0)
        } else {
          // Previous type was defined, now new type: RETAIN PAGE
          setCurrentType(props.type)
        }
      }
    } else {
      // New data and type has NOT changed
      setCurrentPage(0)
    }
    setChartPages(createPagedData(props.chartData, maxColumnsPerPage))
  }, [props.chartData, currentType, props.type, maxColumnsPerPage])

  useEffect(() => {
    setChartPages(createPagedData(props.chartData, maxColumnsPerPage))
    setCurrentPage(0)
  }, [props.chartData, maxColumnsPerPage])

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

  const changePageLeft = () => {
    if (currentPage === 0) {
      setCurrentPage(chartPages.length - 1)
    } else {
      setCurrentPage(currentPage - 1)
    }
  }

  const changePageRight = () => {
    if (currentPage === chartPages.length - 1) {
      setCurrentPage(0)
    } else {
      setCurrentPage(currentPage + 1)
    }
  }

  const swipeConfig = {
    delta: 10,
    preventDefaultTouchmoveEvent: false,
    trackTouch: true,
    trackMouse: false,
    rotationAngle: 0,
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (_eventData) => changePageLeft(),
    onSwipedRight: (_eventData) => changePageRight(),
    ...swipeConfig,
  })

  return (
    <div>
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
          {/* <Tooltip wrapperStyle={{ outline: "none" }} content={renderCustomTooltip(classes)}/> */}
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
              {t('motivation').toUpperCase()}
            </Label>
          </ReferenceLine>
          <ReferenceLine
            y={0.1}
            stroke={KnowitColors.darkGreen}
            strokeWidth={1}
          ></ReferenceLine>
          <ReferenceLine
            y={0}
            stroke={KnowitColors.creme}
            strokeWidth={3}
          ></ReferenceLine>
          <ReferenceLine y={chartSplitAt} stroke={KnowitColors.darkGreen}>
            <Label
              position="insideTopRight"
              fontSize={12}
              fontWeight="bold"
              fill={KnowitColors.darkBrown}
            >
              {t('competence').toUpperCase()}
            </Label>
          </ReferenceLine>
          <ReferenceLine
            y={chartSplitAt - 0.1}
            stroke={KnowitColors.creme}
            strokeWidth={3}
          ></ReferenceLine>
        </BarChart>
      </ResponsiveContainer>
      {maxColumnsPerPage < props.chartData.length ? (
        <div onClick={handleChangePageClick}>{createPager()}</div>
      ) : (
        ''
      )}
    </div>
  )
}

const renderCustomAxisTicks = () => {
  return ({ ...props }: TickProps) => {
    let isKnowledge = false
    let iconNumber = props.payload.value
    if (props.payload.value >= chartSplitAt) {
      iconNumber -= chartSplitAt
      isKnowledge = true
    }
    return (
      <svg
        x={props.x - iconSize}
        y={props.y - iconSize / 2}
        width={iconSize}
        height={iconSize}
        fill="black"
      >
        {GetIcon(isKnowledge, Math.round(iconNumber))};
      </svg>
    )
  }
}

const renderLabelTick = ({ ...props }: TickLabelProps) => {
  const dy = props.index % 2 ? '-1em' : '-6em'
  return (
    <g transform={`translate(${props.x},${props.y})`}>
      <text
        x={0}
        y={dy}
        textAnchor="middle"
        fontSize={10}
        fontWeight="bold"
        fill={KnowitColors.darkGreen}
      >
        {wrapString(props.payload.value, 15).map((s: string, index: number) => (
          <tspan key={index} x="0" dy="1em">
            {s}
          </tspan>
        ))}
      </text>
    </g>
  )
}

// const renderCustomTooltip = (classes: any) => {
//     return ({ ...props }: ToolTipProps<ValueType, NameType>) => {
//         if (props.active && props.payload) {
//             let knowledgeValue = props.payload[0]?.payload.valueKnowledge[1].toFixed(
//                 1
//             );
//             let motivationValue = (
//                 props.payload[1]?.payload.valueMotivation[1] - chartSplitAt
//             ).toFixed(1);
//             return (
//                 <div>
//                     <p >{props.label}</p>
//                     <p >
//                         {`Kompetanse: ${knowledgeValue}`}
//                     </p>
//                     <p >
//                         {`Motivasjon: ${motivationValue}`}
//                     </p>
//                 </div>
//             );
//         }
//         return null;
//     };
// };

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
