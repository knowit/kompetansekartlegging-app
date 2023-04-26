import { useEffect, useState } from 'react'
import { SliderProps } from '../types'
import * as helper from '../helperFunctions'
import { Slider as CoreSlider } from '@mui/material'

const marks = new Array(51).fill(undefined).map((_v, i) => {
  return { value: i / 10 || 0 }
})
const Slider = ({ sliderChanged, motivation, value }: SliderProps) => {
  const [sliderValue, setSliderValue] = useState<number>(-1)

  const customSliderChanged = (_event: any, newValue: number | number[]) => {
    setSliderValue(newValue as number)
  }

  const sliderCommitted = () => {
    setSliderValue(helper.roundDecimals(sliderValue, 1))
    sliderChanged(helper.roundDecimals(sliderValue, 1), motivation)
  }

  useEffect(() => {
    setSliderValue(value)
  }, [value, setSliderValue])

  return (
    <CoreSlider
      value={sliderValue}
      onChange={customSliderChanged}
      onChangeCommitted={sliderCommitted}
      step={0.1}
      max={5}
      marks={marks}
    />
  )
}

export default Slider
