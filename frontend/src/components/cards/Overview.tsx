import { OverviewProps, Panel } from '../../types'
import Highlights from '../Highlights'
import TypedOverviewChart from '../TypedOverviewChart'

export const Overview = ({ ...props }: OverviewProps) => {
  // const buttonClick = () => {
  //     //TODO: Find a way to replace hadcode int with a something like enum (enum dont work)
  //     // props.commonCardProps.setActiveCard(props.commonCardProps.index,  !props.commonCardProps.active);
  // };

  return props.userAnswersLoaded ? (
    props.isMobile ? (
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
    ) : (
      // TODO: Put this in a desktop component
      // <div >
      //     <div className={props.commonCardProps.active ? styles.radarPlot : styles.empty}>
      <div>
        <div>
          <TypedOverviewChart
            isMobile={props.isMobile}
            questionAnswers={props.questionAnswers}
            categories={props.categories}
          />
          <div>
            <Highlights
              isMobile={props.isMobile}
              questionAnswers={props.questionAnswers}
            />
          </div>
        </div>
      </div>
    )
  ) : null
}
