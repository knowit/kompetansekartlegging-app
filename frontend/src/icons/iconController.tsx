import { ReactComponent as K3 } from '../icons/K - blomst.svg'
import { ReactComponent as K0 } from '../icons/K - fro.svg'
import { ReactComponent as K4 } from '../icons/K - jordber.svg'
import { ReactComponent as K2 } from '../icons/K - knopp.svg'
import { ReactComponent as K5 } from '../icons/K - matrixjordber.svg'
import { ReactComponent as K1 } from '../icons/K - spire.svg'

import { ReactComponent as M4 } from '../icons/M - godt.svg'
import { ReactComponent as M0 } from '../icons/M - nei.svg'
import { ReactComponent as M1 } from '../icons/M - nja.svg'
import { ReactComponent as M3 } from '../icons/M - onsker erfaring.svg'
import { ReactComponent as M5 } from '../icons/M - perfekt.svg'
import { ReactComponent as M2 } from '../icons/M - vedbehov.svg'

import { Tooltip } from '@mui/material'
import { Fragment } from 'react'
import i18n from '../i18n/i18n'

const getIconDescription = (knowledge: boolean, level: number): string => {
  if (knowledge) {
    switch (level) {
      case 0:
        return i18n.t('competenceScale.unfamiliar')
      case 1:
        return i18n.t('competenceScale.someInsight')
      case 2:
        return i18n.t('competenceScale.potentiallyUsable')
      case 3:
        return i18n.t('competenceScale.professional')
      case 4:
        return i18n.t('competenceScale.expert')
      case 5:
        return i18n.t('competenceScale.superstar')
      default:
        return ''
    }
  }
  switch (level) {
    case 0:
      return i18n.t('motivationScale.no')
    case 1:
      return i18n.t('motivationScale.neutral')
    case 2:
      return i18n.t('motivationScale.ish')
    case 3:
      return i18n.t('motivationScale.curious')
    case 4:
      return i18n.t('motivationScale.good')
    case 5:
      return i18n.t('motivationScale.enthusiast')
    default:
      return ''
  }
}

const CreateHover = (
  knowledge: boolean,
  level: number,
  className?: string,
  key?: number
): JSX.Element => {
  let element: JSX.Element = <Fragment />
  if (knowledge) {
    switch (level) {
      case 0:
        element = <K0 className={className} />
        break
      case 1:
        element = <K1 className={className} />
        break
      case 2:
        element = <K2 className={className} />
        break
      case 3:
        element = <K3 className={className} />
        break
      case 4:
        element = <K4 className={className} />
        break
      case 5:
        element = <K5 className={className} />
        break
    }
  } else {
    switch (level) {
      case 0:
        element = <M0 className={className} />
        break
      case 1:
        element = <M1 className={className} />
        break
      case 2:
        element = <M2 className={className} />
        break
      case 3:
        element = <M3 className={className} />
        break
      case 4:
        element = <M4 className={className} />
        break
      case 5:
        element = <M5 className={className} />
        break
    }
  }
  return (
    <Tooltip
      key={key ? key : null}
      title={getIconDescription(knowledge, level)}
    >
      <div> {element} </div>
    </Tooltip>
  )
}

export { K0, K1, K2, K3, K4, K5, M0, M1, M2, M3, M4, M5 }

export const GetIcons = (
  knowledge: boolean,
  className?: string
): JSX.Element[] => {
  const els = [
    CreateHover(knowledge, 0, className, 0),
    CreateHover(knowledge, 1, className, 1),
    CreateHover(knowledge, 2, className, 2),
    CreateHover(knowledge, 3, className, 3),
    CreateHover(knowledge, 4, className, 4),
    CreateHover(knowledge, 5, className, 5),
  ]
  return els
}

export const GetIcon = (
  knowledge: boolean,
  level: number,
  className?: string
): JSX.Element => {
  return CreateHover(knowledge, level, className)
}
