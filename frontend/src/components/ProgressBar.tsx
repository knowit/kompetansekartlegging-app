import { useState, useEffect } from 'react'
import { ProgressProps } from '../types'
import { LinearProgressProps, LinearProgress } from '@mui/material'
import styled from '@emotion/styled'

const StyledLinearProgress = styled.div`
  display: grid;
  grid-template-columns: 50px auto;
  align-items: center;
`

export default function ProgressBar({ alerts, totalQuestions }: ProgressProps) {
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const updateProgress = () => {
      const unfilledQuestions = alerts?.qidMap.size ?? 0
      const filledQuestions = totalQuestions - unfilledQuestions
      const progressPercentage = (filledQuestions / totalQuestions) * 100
      setProgress(progressPercentage)
    }
    updateProgress()
  }, [alerts, totalQuestions])

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
