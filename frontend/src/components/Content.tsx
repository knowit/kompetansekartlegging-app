import { Drawer, List, ListItemButton, ListItemText } from '@mui/material'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
import { AlertType, staleAnswersLimit } from './Question'
import { AnswerHistory } from './AnswerHistory'
import {
  createQuestionAnswers,
  fetchLastFormDefinition,
  getUserAnswers,
  setFirstAnswers,
} from './answersApi'
import { Overview } from './Overview'
import { YourAnswers } from './YourAnswers'
import { GroupLeaderPanel } from './GroupLeaderPanel/'
import { superAdminItems } from './SuperAdminPanel/SuperAdminMenu'
import { SuperAdminPanel } from './SuperAdminPanel/SuperAdminPanel'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { DropdownMenuItem } from './DropdownMenuItem'
import getGroupMenuitems from './GroupLeaderPanel/GroupLeaderMenu'
import NavBar from './NavBar'
import styled from '@emotion/styled'
import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import {
  navbarHeight,
  minPanelWidth,
  maxPanelWidth,
  menuWidth,
} from '../styleconstants'

type StylingProps = {
  isSmall: boolean
}

const ContentContainer = styled.div`
  #header {
    max-height: ${navbarHeight}px;
  }

  #panelContainer {
    padding-top: ${navbarHeight}px;
    display: grid;
    grid-template-columns:
      minmax(10px, auto) minmax(${minPanelWidth}px, ${maxPanelWidth}px)
      minmax(10px, auto);
    margin-left: ${(props: StylingProps) =>
      props.isSmall ? '0px' : `${menuWidth}px`};
  }

  #panel {
    grid-column: 2;
  }

  #menu {
    .MuiPaper-root {
      width: ${(props: StylingProps) =>
        props.isSmall ? '100vw' : `${menuWidth}px`};
    }
  }

  ${(props: StylingProps) =>
    !props.isSmall &&
    `#header {
        width: calc(100% - ${menuWidth}px)
      }
    `}
`

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
  setAlerts: Dispatch<SetStateAction<AlertState | undefined>>,
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
  const [categories, setCategories] = useState<string[]>([])
  const [questionAnswers, setQuestionAnswers] = useState<
    Map<string, QuestionAnswer[]>
  >(new Map())
  const [answersBeforeSubmitted, setAnswersBeforeSubmitted] = useState<
    Map<string, QuestionAnswer[]>
  >(new Map())
  const [answerLog, setAnswerLog] = useState<UserFormWithAnswers[]>([])
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false)
  const [isCategorySubmitted, setIsCategorySubmitted] = useState<boolean>(true)
  const [activePanel, setActivePanel] = useState<Panel>(Panel.Overview)
  const [activeCategory, setActiveCategory] = useState<string>('MAIN')
  const [answerEditMode, setAnswerEditMode] = useState<boolean>(false)
  const [alerts, setAlerts] = useState<AlertState>()
  const [activeSubmenuItem, setActiveSubmenuItem] = useState<string>('')

  const [lastClickedPanel, setlastClickedPanel] = useState<Panel>(
    Panel.Overview
  )
  const [lastClickedCategory, setLastClickedCategory] = useState<string>('MAIN')
  const [lastClickedSubmenu, setLastClickedSubmenu] = useState<string>('')

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
        { input: quAnsInput, organizationID: userState.organizationID }
      )
    ).map((result) => result.data?.batchCreateQuestionAnswer)
    if (!result || result.length === 0) {
      return
    }
  }

  const changeActiveCategory = (newActiveCategory: string) => {
    setActiveCategory(newActiveCategory)
    setAnswerEditMode(false)
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
          props.isSmall
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
    props.isSmall,
  ])

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

  const isSuperAdmin = useAppSelector(selectIsSuperAdmin)
  const isAdmin = useAppSelector(selectIsAdmin)
  const isGroupLeader = useAppSelector(selectIsGroupLeader)

  const myAnswers = categories.map((cat) => {
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

  const showFabPanels = [Panel.Overview, Panel.MyAnswers, Panel.GroupLeader]

  useEffect(() => {
    props.setShowFab(activePanel in showFabPanels)
  }, [activePanel])

  const handleMenuClick = (panelSource: Panel, itemSource: string) => {
    const isInAnswer = panelSource === Panel.MyAnswers

    if (answerEditMode) {
      setlastClickedPanel(panelSource)
      setLastClickedCategory(itemSource)
      setAlertDialogOpen(true)
    } else {
      setActivePanel(panelSource)
      if (isInAnswer) {
        setActiveCategory(itemSource)
        setActiveSubmenuItem('NONE')
      } else {
        setActiveCategory('NONE')
        setActiveSubmenuItem(itemSource)
      }
    }
    if (panelSource === Panel.Overview || itemSource !== 'MAIN') {
      props.isSmall && toggleMenuOpen(!open)
    }
  }
  const resetAnswers = () => {
    setQuestionAnswers(new Map(answersBeforeSubmitted))
  }

  const leaveFormButtonClicked = () => {
    resetAnswers()
    setAnswerEditMode(false)
    setActivePanel(lastClickedPanel)

    if (lastClickedPanel === Panel.MyAnswers) {
      setActiveCategory(lastClickedCategory)
    } else {
      setActiveSubmenuItem(lastClickedSubmenu)
    }
    setAlertDialogOpen(false)
    props.setShowFab(activePanel in showFabPanels)
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
            isSmall={props.isSmall}
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
            isSmall={props.isSmall}
            alerts={alerts}
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
            isSmall={props.isSmall}
          />
        )
      case Panel.Admin:
        return <AdminPanel activeSubmenuItem={activeSubmenuItem} />
      case Panel.SuperAdmin:
        return <SuperAdminPanel activeSubmenuItem={activeSubmenuItem} />
    }
    return <div>Not implemented</div>
  }

  const [menuOpen, toggleMenuOpen] = useState(false)

  return (
    <ContentContainer isSmall={props.isSmall}>
      <Drawer
        id="menu"
        variant={props.isSmall ? 'persistent' : 'permanent'}
        open={props.isSmall ? menuOpen : false}
        anchor="left"
      >
        {props.isSmall && (
          <IconButton onClick={() => toggleMenuOpen(!open)}>
            <Close />
          </IconButton>
        )}
        <List>
          <ListItemButton
            selected={activePanel === Panel.Overview}
            onClick={() => handleMenuClick(Panel.Overview, 'MAIN')}
          >
            <ListItemText>{t('menu.overview')}</ListItemText>
          </ListItemButton>
          <DropdownMenuItem
            panelId={Panel.MyAnswers}
            show={true}
            items={myAnswers}
            text={'menu.myAnswers'}
            alert={alerts?.qidMap.size !== 0 ? '!' : 0}
            activeSubmenuItem={activeCategory}
            handleMenuClick={handleMenuClick}
          />

          <DropdownMenuItem
            panelId={Panel.GroupLeader}
            show={isGroupLeader}
            items={getGroupMenuitems(groupMembers)}
            text={'menu.myGroup'}
            alert={0}
            activeSubmenuItem={activeSubmenuItem}
            handleMenuClick={handleMenuClick}
          />

          <DropdownMenuItem
            panelId={Panel.Admin}
            show={isAdmin}
            items={adminItems}
            text={'menu.admin'}
            alert={0}
            activeSubmenuItem={activeSubmenuItem}
            handleMenuClick={handleMenuClick}
          />

          <DropdownMenuItem
            panelId={Panel.SuperAdmin}
            show={isSuperAdmin}
            items={superAdminItems}
            text={'menu.superAdmin'}
            alert={0}
            activeSubmenuItem={activeSubmenuItem}
            handleMenuClick={handleMenuClick}
          />
        </List>
      </Drawer>

      <NavBar
        toggleMenuOpen={toggleMenuOpen}
        isSmall={props.isSmall}
        signout={props.signout}
        isOpen={menuOpen}
      />

      <div id="panelContainer">
        <div id="panel">{setupPanel()}</div>
      </div>

      <AlertDialog
        setAlertDialogOpen={setAlertDialogOpen}
        alertDialogOpen={alertDialogOpen}
        leaveFormButtonClicked={leaveFormButtonClicked}
      />
      <AnswerHistory
        history={answerLog}
        historyViewOpen={props.answerHistoryOpen}
        setHistoryViewOpen={props.setAnswerHistoryOpen}
        isSmall={props.isSmall}
      />
    </ContentContainer>
  )
}

export default Content
