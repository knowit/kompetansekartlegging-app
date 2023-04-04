import React, { useEffect, useState } from 'react'
import { SliderProps } from '../types'
import * as helper from '../helperFunctions'
import { Slider as CoreSlider } from '@mui/material'

const marks = new Array(51).fill(undefined).map((_v, i) => {
  return { value: i / 10 || 0 }
})
const Slider = ({ ...props }: SliderProps) => {
  const [sliderValue, setSliderValue] = useState<number>(-1)

  const sliderChanged = (_event: any, newValue: number | number[]) => {
    setSliderValue(newValue as number)
  }

  const sliderCommitted = () => {
    setSliderValue(helper.roundDecimals(sliderValue, 1))
    props.sliderChanged(helper.roundDecimals(sliderValue, 1), props.motivation)
  }

  useEffect(() => {
    setSliderValue(props.value)
  }, [props.value, setSliderValue])

  return (
    <CoreSlider
      value={sliderValue}
      onChange={sliderChanged}
      onChangeCommitted={sliderCommitted}
      step={0.1}
      max={5}
      marks={marks}
    />
  )
}

export default Slider
