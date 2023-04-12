import { useTranslation } from 'react-i18next'
import { Fragment, useEffect, useState } from 'react'
import { wrapString } from '../helperFunctions'
import { GetIcon } from '../icons/iconController'
import { HighlightsProps, TopicScoreWithIcon } from '../types'
import styled from '@emotion/styled'

const StyledHighlights = styled.article`
  #focusAreas {
    display: flex;
    flex-direction: row;
  }
  #strengths {
    display: flex;
    flex-direction: column;
  }
  #ambitions {
    display: flex;
    flex-direction: column;
  }
  .highlightList {
    display: flex;
    flex-direction: row;
  }
`

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
      props.questionAnswers.forEach((quAns) => {
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

  const createHighlights = (
    aboveCutoff: TopicScoreWithIcon[],
    text: string,
    isKnowledge: boolean
  ): JSX.Element => {
    if (aboveCutoff.length === 0) {
      return <div>{t(text)}</div>
    }
    return (
      <div className="highlightList">
        {aboveCutoff.map((el: any, i) => (
          <div key={i}>
            <div>{GetIcon(isKnowledge, el.icon)}</div>
            <div>{wrapString(el.topic, maxTopicStringLength).join('\n')}</div>
          </div>
        ))}
      </div>
    )
  }

  const knowledgeHighlights = createHighlights(
    knowledgeAboveCutoff,
    'overview.yourTopStrengthsWillBeDisplayedHere',
    true
  )

  const motivationHighlights = createHighlights(
    motivationAboveCutoff,
    'overview.yourTopAmbitionsWillBeDisplayedHere',
    false
  )

  if (props.questionAnswers.size === 0) return <Fragment />
  else
    return (
      <StyledHighlights>
        <h1>{t('overview.focusAreas')}</h1>
        <article id="focusAreas">
          <section id={'strengths'}>
            <h2>{t('overview.topStrengths')}</h2>
            {knowledgeHighlights}
          </section>
          <section id="ambitions">
            <h2>{t('overview.topAmbitions')}</h2>
            {motivationHighlights}
          </section>
        </article>
      </StyledHighlights>
    )
}
