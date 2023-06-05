import styled from '@emotion/styled'

export const KnowitColors = {
  black: '#000000',
  white: '#FFFFFF',
  darkBrown: '#393939',
  creme: '#F1EEEE',
  beige: '#E4E0DC',
  green: '#52B469',
  darkGreen: '#596961',
  lightGreen: '#C3DEC3',
  ecaluptus: '#DFEDE1',
  greyGreen: '#ADB7AF',
  fuchsia: '#EA3FF3',
  burgunder: '#7A3E50',
  flamingo: '#F3C8BA',
  lightPink: '#F7E1DD',
}

export const navbarHeight = 100
export const menuWidth = 250
export const maxPanelWidth = 800
export const minPanelWidth = 200

type StylingProps = {
  isSmall: boolean
}

export const ModalWrapper = styled.div`
  ${(props: StylingProps) => props.isSmall && 'min-width: 100vw;'};
  ${(props: StylingProps) => props.isSmall && 'min-height: 100vh;'};
  padding: 30px;
`
