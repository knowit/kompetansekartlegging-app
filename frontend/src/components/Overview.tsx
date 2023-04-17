import { OverviewProps } from '../types'
import Highlights from './Highlights'
import TypedOverviewChart from './TypedOverviewChart'
import { useTranslation } from 'react-i18next'

export const Overview = ({ ...props }: OverviewProps) => {
  const { t } = useTranslation()
  return props.userAnswersLoaded ? (
    <div>
      <h1>{t('menu.overview')}</h1>
      <TypedOverviewChart
        isSmall={props.isSmall}
        questionAnswers={props.questionAnswers}
        categories={props.categories}
      />
      <Highlights
        isSmall={props.isSmall}
        questionAnswers={props.questionAnswers}
      />
    </div>
  ) : null
}
