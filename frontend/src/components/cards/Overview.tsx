import { OverviewProps } from '../../types'
import Highlights from '../Highlights'
import TypedOverviewChart from '../TypedOverviewChart'

export const Overview = ({ ...props }: OverviewProps) => {
  return props.userAnswersLoaded ? (
    <div>
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
