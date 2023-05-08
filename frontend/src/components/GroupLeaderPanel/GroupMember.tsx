import { useState, useEffect } from 'react'
import CenteredCircularProgress from '../CenteredCircularProgress'
import {
  fetchLastFormDefinition,
  createQuestionAnswers,
  getUserAnswers,
  setFirstAnswers,
} from '../answersApi'
import { getAttribute } from '../AdminPanel/helpers'
import { UserAnswer, QuestionAnswer } from '../../types'
import { Overview } from '../Overview'
import AnswerDiagram from '../AnswerDiagram'
import Nav from './Nav'
import { t } from 'i18next'

const voidFn = () => 1

const GroupMember = ({ members, userId, isSmall }: any) => {
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
              voidFn
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
  }, [userId, isSmall, member])

  const isLoading = loading
  const isError = error

  return (
    <>
      {isError && <p>{t('errorOccured') + isError}</p>}
      {isLoading && <CenteredCircularProgress />}
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
              questionAnswers={questionAnswers}
              isSmall={isSmall}
              userAnswersLoaded={userAnswersLoaded}
            />
          ) : (
            <AnswerDiagram
              activeCategory={category}
              isSmall={isSmall}
              questionAnswers={questionAnswers}
            />
          )}
        </>
      )}
    </>
  )
}

export default GroupMember
