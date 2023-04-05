import {
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
} from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import { CreateQuestionAnswerInput, QuestionType } from '../API'
import * as customQueries from '../graphql/custom-queries'
import * as helper from '../helperFunctions'
import { useAppSelector } from '../redux/hooks'
import {
  selectAdminCognitoGroupName,
  selectGroupLeaderCognitoGroupName,
  selectIsAdmin,
  selectIsGroupLeader,
  selectIsSuperAdmin,
  selectUserState,
} from '../redux/User'
import {
  Alert,
  AlertState,
  ContentProps,
  CreateQuestionAnswerResult,
  FormDefinition,
  Panel,
  QuestionAnswer,
  SliderValues,
  UserAnswer,
  UserFormWithAnswers,
} from '../types'
import { AdminPanel } from './AdminPanel/'
import adminItems from './AdminPanel/AdminMenu'
import { AlertDialog } from './AlertDialog'
import {
  AlertNotification,
  AlertType,
  staleAnswersLimit,
} from './AlertNotification'
import { AnswerHistory } from './AnswerHistory'
import {
  createQuestionAnswers,
  fetchLastFormDefinition,
  getUserAnswers,
  setFirstAnswers,
} from './answersApi'
import { Overview } from './cards/Overview'
import { YourAnswers } from './YourAnswers'
import { GroupLeaderPanel } from './GroupLeaderPanel/'
import NavBarMobile from './NavBarMobile'
import { superAdminItems } from './SuperAdminPanel/SuperAdminMenu'
import { SuperAdminPanel } from './SuperAdminPanel/SuperAdminPanel'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { MenuItem } from './MenuItem'
import getGroupMenuitems from './GroupLeaderPanel/GroupLeaderMenu'

export enum MenuButton {
  Overview,
  MyAnswers,
  Category,
  GroupLeader,
  LeaderCategory,
  Other,
}

const updateCategoryAlerts = (
  questionAnswers: Map<string, QuestionAnswer[]>,
  setAlerts: React.Dispatch<React.SetStateAction<AlertState | undefined>>,
  t: TFunction<'translation', undefined, 'translation'>
) => {
  const msNow = Date.now()
  const alerts = new Map<string, Alert>()
  const catAlerts = new Map<string, number>()

  questionAnswers.forEach((quAnsArr) => {
    quAnsArr.forEach((quAns) => {
      if (
        (quAns.question.type !== QuestionType.CustomScaleLabels &&
          (quAns.motivation === -1 || quAns.knowledge === -1)) ||
        (quAns.question.type === QuestionType.CustomScaleLabels &&
          quAns.customScaleValue === -1)
      ) {
        alerts.set(quAns.question.id, {
          type: AlertType.Incomplete,
          message: t('content.unAnswered'),
        })
        const numAlerts = catAlerts.get(quAns.question.category.text)
        if (numAlerts)
          catAlerts.set(quAns.question.category.text, numAlerts + 1)
        else catAlerts.set(quAns.question.category.text, 1)
      } else if (msNow - quAns.updatedAt > staleAnswersLimit) {
        alerts.set(quAns.question.id, {
          type: AlertType.Outdated,
          message: t('content.shouldBeUpdatedLastAnswered', {
            date: new Date(quAns.updatedAt),
          }),
        })
        const numAlerts = catAlerts.get(quAns.question.category.text)
        if (numAlerts)
          catAlerts.set(quAns.question.category.text, numAlerts + 1)
        else catAlerts.set(quAns.question.category.text, 1)
      }
    })
  })
  setAlerts({ qidMap: alerts, categoryMap: catAlerts })
}

const Content = ({ ...props }: ContentProps) => {
  const { t } = useTranslation()

  const userState = useAppSelector(selectUserState)
  const adminCognitoGroupName = useAppSelector(selectAdminCognitoGroupName)
  const groupLeaderCognitoGroupName = useAppSelector(
    selectGroupLeaderCognitoGroupName
  )

  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(
    null
  )
  const [, setUserAnswers] = useState<UserAnswer[]>([]) //Used only for getting data on load
  const [userAnswersLoaded, setUserAnswersLoaded] = useState(false)
  // const [submitFeedback, setSubmitFeedback] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([])
  const [questionAnswers, setQuestionAnswers] = useState<
    Map<string, QuestionAnswer[]>
  >(new Map())
  // const [answersBeforeSubmitted, setAnswersBeforeSubmitted] = useState<AnswerData[]>([]);
  const [answersBeforeSubmitted, setAnswersBeforeSubmitted] = useState<
    Map<string, QuestionAnswer[]>
  >(new Map())
  // const [historyViewOpen, setHistoryViewOpen] = useState<boolean>(false);
  const [answerLog, setAnswerLog] = useState<UserFormWithAnswers[]>([])
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false)
  const [isCategorySubmitted, setIsCategorySubmitted] = useState<boolean>(true)
  const [activePanel, setActivePanel] = useState<Panel>(Panel.Overview)
  const [activeCategory, setActiveCategory] = useState<string>('dkjfgdrjkg')
  const [answerEditMode, setAnswerEditMode] = useState<boolean>(false)
  const [alerts, setAlerts] = useState<AlertState>()
  const [activeSubmenuItem, setActiveSubmenuItem] = useState<string>('')

  const updateAnswer = (
    category: string,
    sliderMap: Map<string, SliderValues>
  ): void => {
    const newAnswers: QuestionAnswer[] =
      questionAnswers.get(category)?.map((quAns) => {
        const sliderValues = sliderMap.get(quAns.question.id) as QuestionAnswer
        if (sliderValues.customScaleValue != null) {
          return {
            ...quAns,
            customScaleValue: sliderValues ? sliderValues.customScaleValue : -2,
            updatedAt: Date.now(),
          }
        }
        return {
          ...quAns,
          knowledge: sliderValues ? sliderValues.knowledge : -2, //If is -2, something is wrong
          motivation: sliderValues ? sliderValues.motivation : -2,
          updatedAt: Date.now(),
        }
      }) || []
    setQuestionAnswers(new Map(questionAnswers.set(category, newAnswers)))
  }

  const createUserForm = async () => {
    setIsCategorySubmitted(true)
    setAnswersBeforeSubmitted(new Map(questionAnswers))
    setAnswerEditMode(false)
    if (!formDefinition) {
      console.error('Missing formDefinition!')
      return
    }
    const quAnsInput: CreateQuestionAnswerInput[] = []
    questionAnswers.get(activeCategory)?.forEach((quAns) => {
      if (
        quAns.question.type === QuestionType.CustomScaleLabels &&
        quAns.customScaleValue !== -1
      ) {
        console.log('Update found', quAns)
        quAnsInput.push({
          userFormID: '',
          questionID: quAns.question.id,
          customScaleValue: quAns.customScaleValue,
          formDefinitionID: formDefinition.id.toString(),
          orgAdmins: adminCognitoGroupName,
          orgGroupLeaders: groupLeaderCognitoGroupName,
        })
        return
      }

      if (quAns.knowledge < 0 && quAns.motivation < 0) return
      quAnsInput.push({
        userFormID: '',
        questionID: quAns.question.id,
        knowledge: quAns.knowledge,
        motivation: quAns.motivation,
        formDefinitionID: formDefinition.id.toString(),
        orgAdmins: adminCognitoGroupName,
        orgGroupLeaders: groupLeaderCognitoGroupName,
      })
    })
    if (quAnsInput.length === 0) {
      console.error('Error finding active category when creating userform')
      return
    }
    const result = (
      await helper.callBatchGraphQL<CreateQuestionAnswerResult>(
        customQueries.batchCreateQuestionAnswer2,
        { input: quAnsInput, organizationID: userState.organizationID },
        'QuestionAnswer'
      )
    ).map((result) => result.data?.batchCreateQuestionAnswer)
    // console.log("Result: ", result);
    if (!result || result.length === 0) {
      return
    }
  }

  const changeActiveCategory = (newActiveCategory: string) => {
    setActiveCategory(newActiveCategory)
    setAnswerEditMode(false)
  }

  const resetAnswers = () => {
    // setAnswers(JSON.parse(JSON.stringify(answersBeforeSubmitted))) // json.parse to deep copy
    setQuestionAnswers(new Map(answersBeforeSubmitted))
  }

  const submitAndProceed = () => {
    createUserForm()
    const currentIndex = categories.findIndex((cat) => cat === activeCategory)
    if (categories.length >= currentIndex) {
      changeActiveCategory(categories[currentIndex + 1])
      setAnswerEditMode(true)
    }
  }

  useEffect(() => {
    setActiveCategory(categories[0])
    // setAnswerEditMode(false);
  }, [categories])

  useEffect(() => {
    updateCategoryAlerts(questionAnswers, setAlerts, t)
  }, [questionAnswers, t])

  useEffect(() => {
    fetchLastFormDefinition(
      setFormDefinition,
      (formDef) => createQuestionAnswers(formDef, setCategories),
      (formDef) =>
        getUserAnswers(
          formDef,
          userState.userName,
          setUserAnswers,
          setActivePanel,
          setUserAnswersLoaded,
          setAnswerEditMode,
          props.setFirstTimeLogin,
          props.setScaleDescOpen,
          props.isMobile
        ),
      (quAns, newUserAnswers) =>
        setFirstAnswers(
          quAns,
          newUserAnswers,
          setQuestionAnswers,
          setAnswersBeforeSubmitted
        )
    )
  }, [
    userState,
    props.setFirstTimeLogin,
    props.setScaleDescOpen,
    props.isMobile,
  ])

  useEffect(() => {
    setAnswersBeforeSubmitted(new Map(questionAnswers))
  }, [questionAnswers])

  const { answerHistoryOpen, setAnswerHistoryOpen } = props
  useEffect(() => {
    const fetchUserFormsAndOpenView = async () => {
      // debugger
      const allUserForms = await helper.listUserForms()
      setAnswerLog(allUserForms)
      setAnswerHistoryOpen(true)
    }

    if (answerHistoryOpen) {
      fetchUserFormsAndOpenView()
    } else {
      setAnswerHistoryOpen(false)
    }
  }, [answerHistoryOpen, setAnswerHistoryOpen])

  useEffect(() => {
    window.onbeforeunload = confirmExit
    function confirmExit() {
      if (!isCategorySubmitted) {
        return 'show warning'
      }
    }
  }, [isCategorySubmitted])

  const [lastButtonClicked, setLastButtonClicked] = useState<{
    buttonType: MenuButton
    category?: string
  }>({
    //Custom type might better be moved to type variable
    buttonType: MenuButton.Overview,
    category: undefined,
  })

  //TODO: Remove this function when refactor is done. Needed to not change mobile too much for now
  const dummyFunctionForRefactor = () => {
    return
  }

  const checkIfCategoryIsSubmitted = (
    buttonType: MenuButton,
    category?: string
  ) => {
    if (isCategorySubmitted) {
      menuButtonClicked(buttonType, category)
    } else {
      setLastButtonClicked({
        buttonType: buttonType,
        category: category,
      })
      setAlertDialogOpen(true)
    }
  }

  const leaveFormButtonClicked = () => {
    setAnswerEditMode(false)
    setAlertDialogOpen(false)
    setIsCategorySubmitted(true)
    resetAnswers()
    menuButtonClicked(lastButtonClicked.buttonType, lastButtonClicked.category)
  }

  const menuButtonClicked = (buttonType: MenuButton, category?: string) => {
    props.setShowFab(true)
    switch (buttonType) {
      case MenuButton.Overview:
        setActivePanel(Panel.Overview)
        break
      case MenuButton.MyAnswers:
        setActivePanel(Panel.MyAnswers)
        if (category) setActiveCategory(category)
        break
      case MenuButton.Category:
        setActiveCategory(category || '')
        setAnswerEditMode(false)
        break
      case MenuButton.Other:
        setActivePanel(Panel.Other)
        console.log('Other button pressed', category)
        break
    }
  }

  ;<AlertNotification
    type={AlertType.Multiple}
    message={t('content.answerOutdatedOrIncomplete')}
    size={0}
  />

  const isSuperAdmin = useAppSelector(selectIsSuperAdmin)
  const isAdmin = useAppSelector(selectIsAdmin)
  const isGroupLeader = useAppSelector(selectIsGroupLeader)

  const myAnswers = categories.map((cat, index) => {
    return {
      key: cat,
      text: cat,
      alert: alerts?.categoryMap.get(cat),
    }
  })

  const enableAnswerEditMode = () => {
    setAnswersBeforeSubmitted(new Map(questionAnswers))
    setAnswerEditMode(true)
  }

  const [groupMembers, setGroupMembers] = useState<any>([])
  const setupPanel = (): JSX.Element => {
    switch (activePanel) {
      case Panel.Overview:
        return (
          <Overview
            activePanel={activePanel}
            questionAnswers={questionAnswers}
            categories={categories}
            isMobile={props.isMobile}
            userAnswersLoaded={userAnswersLoaded}
          />
        )
      case Panel.MyAnswers:
        return (
          <YourAnswers
            activePanel={activePanel}
            setIsCategorySubmitted={setIsCategorySubmitted}
            createUserForm={createUserForm}
            submitAndProceed={submitAndProceed}
            updateAnswer={updateAnswer}
            formDefinition={formDefinition}
            questionAnswers={questionAnswers}
            changeActiveCategory={changeActiveCategory}
            categories={categories}
            activeCategory={activeCategory}
            enableAnswerEditMode={enableAnswerEditMode}
            answerEditMode={answerEditMode}
            isMobile={props.isMobile}
            alerts={alerts}
            checkIfCategoryIsSubmitted={checkIfCategoryIsSubmitted}
            collapseMobileCategories={props.collapseMobileCategories}
            categoryNavRef={props.categoryNavRef}
            scrollToTop={props.scrollToTop}
            setCollapseMobileCategories={props.setCollapseMobileCategories}
          />
        )
      case Panel.GroupLeader:
        return (
          <GroupLeaderPanel
            setActiveSubmenuItem={setActiveSubmenuItem}
            activeSubmenuItem={activeSubmenuItem}
            members={groupMembers}
            setMembers={setGroupMembers}
          />
        )
      case Panel.Admin:
        return <AdminPanel activeSubmenuItem={activeSubmenuItem} />
      case Panel.SuperAdmin:
        return <SuperAdminPanel activeSubmenuItem={activeSubmenuItem} />
      case Panel.Other:
        return <div>Hello! This is the "Other" panel :D</div>
    }
    return <div>Not implemented</div>
  }

  return (
    <div className="content">
      <Drawer className="menu" variant="permanent" anchor="left">
        <List>
          <ListItemButton onClick={() => setActivePanel(Panel.Overview)}>
            <ListItemText>{t('menu.overview')}</ListItemText>
          </ListItemButton>
          <MenuItem
            panelId={Panel.MyAnswers}
            show={true}
            setActivePanel={setActivePanel}
            curActivePanel={activePanel}
            items={myAnswers}
            text={'menu.myAnswers'}
            alert={alerts?.qidMap.size ?? 0}
            setActiveSubmenuItem={setActiveSubmenuItem}
            activeSubmenuItem={activeCategory}
          />

          <MenuItem
            panelId={Panel.GroupLeader}
            show={isAdmin} //TODO: remove
            setActivePanel={setActivePanel}
            curActivePanel={activePanel}
            items={getGroupMenuitems(groupMembers)}
            text={'menu.myGroup'}
            alert={0}
            setActiveSubmenuItem={setActiveSubmenuItem}
            activeSubmenuItem={activeSubmenuItem}
          />

          <MenuItem
            panelId={Panel.Admin}
            show={isAdmin}
            setActivePanel={setActivePanel}
            curActivePanel={activePanel}
            items={adminItems}
            text={'menu.admin'}
            alert={0}
            setActiveSubmenuItem={setActiveSubmenuItem}
            activeSubmenuItem={activeSubmenuItem}
          />

          <MenuItem
            panelId={Panel.SuperAdmin}
            show={isAdmin} //TODO: remove
            setActivePanel={setActivePanel}
            curActivePanel={activePanel}
            items={superAdminItems}
            text={'menu.superAdmin'}
            alert={0}
            setActiveSubmenuItem={setActiveSubmenuItem}
            activeSubmenuItem={activeSubmenuItem}
          />
        </List>
      </Drawer>

      <div className="panel">{setupPanel()}</div>
      <AlertDialog
        setAlertDialogOpen={setAlertDialogOpen}
        alertDialogOpen={alertDialogOpen}
        changeActiveCategory={dummyFunctionForRefactor} //setActiveCategory}
        clickedCategory={activeCategory}
        setIsCategorySubmitted={setIsCategorySubmitted}
        resetAnswers={resetAnswers}
        leaveFormButtonClicked={leaveFormButtonClicked} //Temp added here, replace changeActiveCategory
        isMobile={props.isMobile}
      />
      <AnswerHistory
        history={answerLog}
        historyViewOpen={props.answerHistoryOpen}
        setHistoryViewOpen={props.setAnswerHistoryOpen}
        isMobile={props.isMobile}
      />
    </div>
  )
}

export default Content
