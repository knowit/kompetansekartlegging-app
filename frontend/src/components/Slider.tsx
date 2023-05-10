import { Slider as CoreSlider, Theme } from '@mui/material'
import { makeStyles, withStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import * as helper from '../helperFunctions'
import { KnowitColors } from '../styles'
import { SliderProps } from '../types'

const ValueSlider = withStyles(
  {
    thumb: {
      height: 28,
      width: 28,
      backgroundColor: KnowitColors.beige,
      marginTop: -14,
      marginLeft: -14,
      opacity: 0,
    },
    track: {
      visibility: 'hidden',
      backgroundColor: KnowitColors.white,
      height: 15,
    },
    rail: {
      opacity: 0,
      height: 15,
    },
    mark: {
      backgroundColor: KnowitColors.white,
      height: 15,
      width: 4,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: KnowitColors.black,
      borderRadius: 10,
      marginTop: -3,
      marginLeft: -2,
      alignSelf: 'center',
    },
    markActive: {},
    '@global': {
      'span:nth-child(3)': {
        height: 30,
      },
      'span:nth-child(13)': {
        height: 30,
      },
      'span:nth-child(23)': {
        height: 30,
      },
      'span:nth-child(33)': {
        height: 30,
      },
      'span:nth-child(43)': {
        height: 30,
      },
      'span:nth-child(53)': {
        height: 30,
      },
    },
    root: {
      display: 'flex',
    },
  },
  { name: 'MuiSlider' }
)(CoreSlider)

const ValueSliderMobile = withStyles(
  {
    thumb: {
      height: 28,
      width: 28,
      backgroundColor: KnowitColors.beige,
      marginTop: -14,
      marginLeft: -14,
      opacity: 0,
    },
    track: {
      visibility: 'hidden',
      backgroundColor: KnowitColors.white,
      height: 15,
    },
    rail: {
      opacity: 0,
      height: 15,
    },
    mark: {
      backgroundColor: KnowitColors.white,
      height: 10,
      width: 4,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: KnowitColors.darkGreen,
      borderRadius: 10,
      marginTop: -3,
      marginLeft: -2,
      alignSelf: 'center',
    },
    markActive: {},
    '@global': {
      'span:nth-child(3)': {
        height: 20,
      },
      'span:nth-child(13)': {
        height: 20,
      },
      'span:nth-child(23)': {
        height: 20,
      },
      'span:nth-child(33)': {
        height: 20,
      },
      'span:nth-child(43)': {
        height: 20,
      },
      'span:nth-child(53)': {
        height: 20,
      },
    },
    root: {
      display: 'flex',
    },
  },
  { name: 'MuiSlider' }
)(CoreSlider)

interface StyleProps {
  markColor: string
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  markActive: (props) => ({
    opacity: 1,
    backgroundColor: props.markColor,
  }),
}))

const marks = new Array(51).fill(undefined).map((_v, i) => {
  return { value: i / 10 || 0 }
})
// [
//     { value: 0, },
//     { value: 1, },
//     { value: 2, },
//     { value: 3, },
//     { value: 4, },
//     { value: 5, },
// ];

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

  const markActiveSelector: StyleProps =
    sliderValue === -1
      ? { markColor: KnowitColors.white }
      : { markColor: KnowitColors.black }

  const classes = useStyles(markActiveSelector)

  return !props.isMobile ? (
    <ValueSlider
      // valueLabelDisplay="on"
      // valueLabelFormat={value => roundDecimals(value, 1)}
      value={sliderValue}
      onChange={sliderChanged}
      onChangeCommitted={sliderCommitted}
      step={0.1}
      max={5}
      marks={marks}
      classes={classes}
    />
  ) : (
    <ValueSliderMobile
      // valueLabelDisplay="on"
      // valueLabelFormat={value => roundDecimals(value, 1)}
      value={sliderValue}
      onChange={sliderChanged}
      onChangeCommitted={sliderCommitted}
      step={0.1}
      max={5}
      marks={marks}
      classes={classes}
    />
  )
}

export default Slider
