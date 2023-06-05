import { OverviewProps } from '../types'
import Highlights from './Highlights'
import TypedOverviewChart from './TypedOverviewChart'

export const Overview = ({
  questionAnswers,
  isSmall,
  userAnswersLoaded,
}: OverviewProps) => {
  return userAnswersLoaded ? (
    <div>
      <TypedOverviewChart isSmall={isSmall} questionAnswers={questionAnswers} />
      <Highlights isSmall={isSmall} questionAnswers={questionAnswers} />
    </div>
  ) : null
}
