import { useTranslation } from 'react-i18next'
import { Fragment, useEffect, useState } from 'react'
import { wrapString } from '../helperFunctions'
import { GetIcon } from '../icons/iconController'
import { KnowitColors } from '../styles'
import { HighlightsProps, TopicScoreWithIcon } from '../types'

const barIconSize = 24
const barIconSizeMobile = 20

export default function Highlights({ ...props }: HighlightsProps) {
  const { t } = useTranslation()

  const [knowledgeAboveCutoff, setKnowledgeAboveCutoff] = useState<
    TopicScoreWithIcon[]
  >([])
  const [motivationAboveCutoff, setMotivationAboveCutoff] = useState<
    TopicScoreWithIcon[]
  >([])

  const shortlistCutoff = 2.0
  const maxInList = 4

  const maxLengthByWidth = (minNumLetters: number) => {
    const width = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    )
    let factor = 27 //Scaling factor
    let desktopPanelWidth = 0
    if (!props.isMobile) {
      factor = 60 //Scaling factor for desktop
      desktopPanelWidth = 0.2 * width //Menu panel is 20% of width (Content.tsx)
    }
    const topicWrapScaler = Math.round((width - desktopPanelWidth) / factor)
    return Math.max(minNumLetters, topicWrapScaler)
  }
  const maxTopicStringLength = maxLengthByWidth(8)

  useEffect(() => {
    const generateShortlist = () => {
      const shortlistMotivation: TopicScoreWithIcon[] = []
      const shortlistKnowledge: TopicScoreWithIcon[] = []
      props.questionAnswers.forEach((quAns, _cat) => {
        quAns.forEach((answer) => {
          if (answer.knowledge >= shortlistCutoff) {
            shortlistKnowledge.push({
              topic: answer.question.topic,
              score: answer.knowledge,
              icon: Math.floor(answer.knowledge),
            })
          }
          if (answer.motivation >= shortlistCutoff) {
            shortlistMotivation.push({
              topic: answer.question.topic,
              score: answer.motivation,
              icon: Math.floor(answer.motivation),
            })
          }
        })
      })
      setKnowledgeAboveCutoff(
        shortlistKnowledge.sort((a, b) => b.score - a.score).slice(0, maxInList)
      )
      setMotivationAboveCutoff(
        shortlistMotivation
          .sort((a, b) => b.score - a.score)
          .slice(0, maxInList)
      )
    }
    generateShortlist()
  }, [props.questionAnswers])

  const createMotivationHighlights = (): JSX.Element => {
    if (motivationAboveCutoff.length === 0) {
      return (
        <div>
          <div>{t('overview.yourTopAmbitionsWillBeDisplayedHere')}</div>
        </div>
      )
    }
    return (
      <div>
        <div>
          <div />
          {motivationAboveCutoff.map((el, i) => (
            <div key={i}>
              <div>
                <div>{GetIcon(false, el.icon)}</div>
              </div>
              <div>{wrapString(el.topic, maxTopicStringLength).join('\n')}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const createKnowledgeHighlights = (): JSX.Element => {
    if (knowledgeAboveCutoff.length === 0) {
      return (
        <div>
          <div>{t('overview.yourTopStrengthsWillBeDisplayedHere')}</div>
        </div>
      )
    }
    return (
      <div>
        <div>
          <div />
          {knowledgeAboveCutoff.map((el, i) => (
            <div key={i}>
              <div>
                <div>{GetIcon(true, el.icon)}</div>
              </div>
              <div>{wrapString(el.topic, maxTopicStringLength).join('\n')}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (props.questionAnswers.size === 0) return <Fragment />
  else
    return (
      <div>
        <div>{t('overview.focusAreas')}</div>
        <div>
          <div>
            <div>{t('overview.topStrengths')}</div>
            {createKnowledgeHighlights()}
          </div>
          <div>
            <div>{t('overview.topAmbitions')}</div>
            {createMotivationHighlights()}
          </div>
        </div>
      </div>
    )
}
