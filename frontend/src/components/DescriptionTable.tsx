import IconButton from '@mui/material/IconButton'
import SvgIcon from '@mui/material/SvgIcon'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { FunctionComponent, MouseEventHandler, SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n/i18n'
import * as Icon from '../icons/iconController'
import { KnowitColors } from '../styles'

export const CloseIcon = () => (
  <SvgIcon>
    <svg viewBox="0 0 32 32">
      <path d="M21,18.5L18.5,21l11,10.9l2.5-2.5L21,18.5z" />
      <path d="M2.5,0L0,2.5l11,10.9l2.5-2.5L2.5,0z" />
      <path d="M29.5,0.1L0,29.5L2.5,32L32,2.6L29.5,0.1z" />
    </svg>
  </SvgIcon>
)

const DescTableStyle = makeStyles({
  root: {
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    maxHeight: 'inherit',
    borderRadius: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    color: KnowitColors.darkBrown,
  },
  overflowContainer: {
    overflow: 'auto',
    borderRadius: 'inherit',
  },
  scaleRow: {
    margin: '15px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scaleTitle: {
    display: 'flex',
    fontSize: '18px',
    lineHeight: '17px',
    fontFamily: 'Arial',
    fontWeight: 700,
    textTransform: 'uppercase',
    margin: '20px 0',
  },
  mobileTitleRow: {
    margin: '20px 20px 0 20px',
  },
  mobileTitle: {
    fontSize: '22px',
    margin: '0px',
  },
  closeButton: {
    color: 'black',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    margin: '5px 0',
  },
  iconArea: {
    height: 30,
    paddingRight: 5,
  },
  icon: {
    height: '100%',
  },
  textBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'left',
    fontSize: 12,
  },
})

type ScaleContainerProps = {
  icon: JSX.Element
  heading: string
  text: string
}

type ScaleContainerObject = {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>
  heading: string
  text: string
}

// Possibly a better way to do this...
// Function > variable to support i18n language change
const getCompetence = (): ScaleContainerObject[] => [
  {
    icon: Icon.K5,
    heading: i18n.t('competenceScale.superstar'),
    text: i18n.t('competenceScale.description.superstar'),
  },
  {
    icon: Icon.K4,
    heading: i18n.t('competenceScale.expert'),
    text: i18n.t('competenceScale.description.expert'),
  },
  {
    icon: Icon.K3,
    heading: i18n.t('competenceScale.professional'),
    text: i18n.t('competenceScale.description.professional'),
  },
  {
    icon: Icon.K2,
    heading: i18n.t('competenceScale.potentiallyUsable'),
    text: i18n.t('competenceScale.description.potentiallyUsable'),
  },

  {
    icon: Icon.K1,
    heading: i18n.t('competenceScale.someInsight'),
    text: i18n.t('competenceScale.description.someInsight'),
  },
  {
    icon: Icon.K0,
    heading: i18n.t('competenceScale.unfamiliar'),
    text: '',
  },
]

const getMotivation = (): ScaleContainerObject[] => [
  {
    icon: Icon.M5,
    heading: i18n.t('motivationScale.enthusiast'),
    text: '',
  },
  {
    icon: Icon.M4,
    heading: i18n.t('motivationScale.good'),
    text: '',
  },
  {
    icon: Icon.M3,
    heading: i18n.t('motivationScale.curious'),
    text: '',
  },
  {
    icon: Icon.M2,
    heading: i18n.t('motivationScale.ish'),
    text: '',
  },
  {
    icon: Icon.M1,
    heading: i18n.t('motivationScale.neutral'),
    text: '',
  },
  {
    icon: Icon.M0,
    heading: i18n.t('motivationScale.no'),
    text: '',
  },
]

type DescriptionTableProps = {
  onClose: MouseEventHandler<HTMLButtonElement>
  isMobile: boolean
}

export const DescriptionTable = ({
  onClose,
  isMobile,
}: DescriptionTableProps) => {
  const { t } = useTranslation()
  const style = DescTableStyle()

  const ScaleContainer = ({ ...props }: ScaleContainerProps) => (
    <div className={style.container}>
      <div className={style.iconArea}>{props.icon}</div>
      <div className={style.textBlock}>
        <div className={style.heading}>{props.heading}</div>
        <div className={style.text}>{props.text}</div>
      </div>
    </div>
  )

  return (
    <div className={style.root}>
      {isMobile && (
        <div className={clsx([style.scaleRow, style.mobileTitleRow])}>
          <header className={style.header}>
            <h2 className={clsx([style.scaleTitle, style.mobileTitle])}>
              {t('scaleDescription')}
            </h2>
            <IconButton
              aria-label={t('close') as string}
              className={style.closeButton}
              onClick={onClose}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </header>
        </div>
      )}

      <div className={style.overflowContainer}>
        <div className={style.scaleRow}>
          <header className={style.header}>
            <h2 className={style.scaleTitle}>
              {t('competenceScale.competenceScale')}
            </h2>
            {!isMobile && (
              <IconButton
                aria-label={t('close') as string}
                className={style.closeButton}
                onClick={onClose}
                size="large"
              >
                <CloseIcon />
              </IconButton>
            )}
          </header>
          {getCompetence().map((obj, i) => {
            const Icon = obj.icon
            return (
              <ScaleContainer
                key={`competence-${i}`}
                icon={<Icon className={style.iconArea} />}
                heading={obj.heading}
                text={obj.text}
              />
            )
          })}
        </div>

        <div className={style.scaleRow}>
          <header className={style.header}>
            <h2 className={style.scaleTitle}>
              {i18n.t('motivationScale.motivationScale')}
            </h2>
          </header>
          {getMotivation().map((obj, i) => {
            const Icon = obj.icon
            return (
              <ScaleContainer
                key={`motivation-${i}`}
                icon={<Icon className={style.iconArea} />}
                heading={obj.heading}
                text={obj.text}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DescriptionTable
