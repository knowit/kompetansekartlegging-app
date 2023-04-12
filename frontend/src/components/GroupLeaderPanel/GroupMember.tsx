import { useEffect, useState } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'

import { t } from 'i18next'
import { Panel, QuestionAnswer, UserAnswer } from '../../types'
import { getAttribute } from '../AdminPanel/helpers'
import AnswerDiagram from '../AnswerDiagram'
import {
  createQuestionAnswers,
  fetchLastFormDefinition,
  getUserAnswers,
  setFirstAnswers,
} from '../answersApi'
import { Overview } from '../cards/Overview'
import Nav from './Nav'

const voidFn = () => 1

const GroupMember = ({ members, userId, isMobile = false }: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [categories, setCategories] = useState<string[]>([])
  const [category, setCategory] = useState<string>('Oversikt')
  const [userAnswersLoaded, setUserAnswersLoaded] = useState(false)
  const [questionAnswers, setQuestionAnswers] = useState<
    Map<string, QuestionAnswer[]>
  >(new Map())
  const [, setAnswersBeforeSubmitted] = useState<Map<string, QuestionAnswer[]>>(
    new Map()
  )
  const [, setUserAnswers] = useState<UserAnswer[]>([])

  const member = members.find((m: any) => m.Username === userId)
  const name = getAttribute(member, 'name')
  useEffect(() => {
    setCategory('Oversikt')
    const fn = async () => {
      setLoading(true)
      try {
        await fetchLastFormDefinition(
          voidFn,
          (formDef) => createQuestionAnswers(formDef, setCategories),
          (formDef) =>
            getUserAnswers(
              formDef,
              member.username || member.Username,
              setUserAnswers,
              voidFn,
              setUserAnswersLoaded,
              voidFn,
              voidFn,
              voidFn,
              isMobile
            ),
          (quAns, newUserAnswers) =>
            setFirstAnswers(
              quAns,
              newUserAnswers,
              setQuestionAnswers,
              setAnswersBeforeSubmitted
            )
        )
      } catch (e) {
        setError(typeof e == 'string' ? e.toString() : 'undefined')
      }
      setLoading(false)
    }
    fn()
  }, [userId, isMobile, member])

  const isLoading = loading
  const isError = error

  return (
    <>
      {isError && <p>{t('errorOccured') + isError}</p>}
      {isLoading && <CircularProgress />}
      {!isError && !isLoading && questionAnswers && (
        <>
          <Nav
            categories={categories}
            category={category}
            setCategory={setCategory}
            name={name}
          />
          {category === 'Oversikt' ? (
            <Overview
              activePanel={Panel.Overview}
              questionAnswers={questionAnswers}
              categories={categories}
              isMobile={isMobile}
              userAnswersLoaded={userAnswersLoaded}
            />
          ) : (
            <AnswerDiagram
              activeCategory={category}
              isMobile={isMobile}
              questionAnswers={questionAnswers}
            />
          )}
        </>
      )}
    </>
  )
}

export default GroupMember
