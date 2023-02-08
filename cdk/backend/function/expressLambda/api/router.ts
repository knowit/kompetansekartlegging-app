import express from 'express'
import { categoryRouter } from './categories/router'
import { debugRouter } from './debug/debugRouter'
import { groupRouter } from './groups/router'
import { organizationRouter } from './organizations/router'
import { questionsRouter } from './questions/router'
import { questionAnswersRouter } from './questionAnswers/router'
import { formDefinitionRouter } from './formDefinitions/router'

const router = express.Router()

router.use('/debug', debugRouter)
router.use('/organizations', organizationRouter)
router.use('/groups', groupRouter)
router.use('/categories', categoryRouter)
router.use('/questionAnswers', questionAnswersRouter)
router.use('/questions', questionsRouter)
router.use('/formDefinitions', formDefinitionRouter)

export { router as apiRouter }