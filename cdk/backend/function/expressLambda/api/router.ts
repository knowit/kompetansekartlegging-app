import express from 'express'
import { categoryRouter } from './category/categoryRouter'
import { debugRouter } from './debug/debugRouter'
import { groupRouter } from './group/groupRouter'
import { organizationRouter } from './organization/organizationRouter'
import { questionsRouter } from './questions/questionsRouter'
import { questionAnswersRouter } from './questionAnswers/questionAnswersRouter'
import { formDefinitionRouter } from './formDefinition/formDefinitionRouter'

const router = express.Router()

router.use('/debug', debugRouter)
router.use('/organizations', organizationRouter)
router.use('/groups', groupRouter)
router.use('/categories', categoryRouter)
router.use('/questionAnswers', questionAnswersRouter)
router.use('/questions', questionsRouter)
router.use('/formDefinitions', formDefinitionRouter)

export { router as apiRouter }
