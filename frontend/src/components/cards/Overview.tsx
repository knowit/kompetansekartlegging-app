import { OverviewProps, Panel } from '../../types'
import Highlights from '../Highlights'
import TypedOverviewChart from '../TypedOverviewChart'

export const Overview = ({ ...props }: OverviewProps) => {
  return props.userAnswersLoaded ? (
    <div>
      <TypedOverviewChart
        isMobile={props.isMobile}
        questionAnswers={props.questionAnswers}
        categories={props.categories}
      />
      <Highlights
        isMobile={props.isMobile}
        questionAnswers={props.questionAnswers}
      />
    </div>
  ) : null
}
