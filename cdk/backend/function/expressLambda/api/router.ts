import express from 'express'
import { categoryRouter } from './category/categoryRouter'
import { debugRouter } from './debug/debugRouter'
import { formDefinitionRouter } from './formDefinition/formDefinitionRouter'
import { groupRouter } from './group/groupRouter'
import { organizationRouter } from './organization/organizationRouter'
import { questionAnswerRouter } from './questionAnswer/questionAnswerRouter'

const router = express.Router()

router.use('/debug', debugRouter)
router.use('/organization', organizationRouter)
router.use('/group', groupRouter)
router.use('/categories', categoryRouter)
router.use('/questionAnswer', questionAnswerRouter)
router.use('/formDefinition', formDefinitionRouter)

export { router as apiRouter }
