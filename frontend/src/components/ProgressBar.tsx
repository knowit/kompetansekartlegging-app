import { useState, useEffect } from 'react'
import { ProgressProps } from '../types'
import { LinearProgressProps, LinearProgress } from '@mui/material'
import styled from '@emotion/styled'

const StyledLinearProgress = styled.div`
  display: grid;
  grid-template-columns: 50px auto;
  align-items: center;
`

export default function ProgressBar({ ...props }: ProgressProps) {
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const updateProgress = () => {
      const unfilledQuestions = props.alerts?.qidMap.size ?? 0
      const filledQuestions = props.totalQuestions - unfilledQuestions
      const progressPercentage = (filledQuestions / props.totalQuestions) * 100
      setProgress(progressPercentage)
    }
    updateProgress()
  }, [props.alerts, props.totalQuestions])

  const LinearProgressWithPercentage = (
    props: LinearProgressProps & { value: number }
  ) => {
    return (
      <StyledLinearProgress>
        {`${Math.round(progress)}%`}
        <LinearProgress variant="determinate" {...props} />
      </StyledLinearProgress>
    )
  }

  return <LinearProgressWithPercentage value={progress} />
}
