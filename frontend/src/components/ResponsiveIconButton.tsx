import { Button } from '@mui/material'
import { useWindowDimensions } from '../helperFunctions'
import { ReactNode } from 'react'
import styled from '@emotion/styled'

type StylingProps = {
  isSmall: boolean
}

const StyledButton = styled.div`
  span {
    ${(props: StylingProps) => props.isSmall && 'margin:0;'}
  }
`

type ButtonProps = {
  startIcon?: ReactNode
  endIcon?: ReactNode
  text: string
  onClick: () => void
}

const ResponsiveIconButton = ({
  startIcon,
  endIcon,
  text,
  onClick,
}: ButtonProps) => {
  if (!startIcon && !endIcon) {
    return (
      <Button onClick={onClick} variant="contained">
        {text}
      </Button>
    )
  }

  const { width } = useWindowDimensions()
  const isSmall = width < 500

  return (
    <StyledButton isSmall>
      <Button
        onClick={onClick}
        startIcon={startIcon}
        endIcon={endIcon}
        variant="contained"
      >
        {isSmall ? '' : text}
      </Button>
    </StyledButton>
  )
}

export default ResponsiveIconButton
