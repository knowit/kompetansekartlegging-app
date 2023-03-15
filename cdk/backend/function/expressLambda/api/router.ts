import express from 'express'
import { catalogRouter } from './catalog/router'
import { categoryRouter } from './categories/router'
import { cognitoRouter } from './cognito/router'
import { debugRouter } from './debug/debugRouter'
import { groupRouter } from './groups/router'
import { organizationRouter } from './organizations/router'
import { questionAnswersRouter } from './questionAnswers/router'
import { questionsRouter } from './questions/router'

const router = express.Router()

router.use('/debug', debugRouter)
router.use('/organizations', organizationRouter)
router.use('/groups', groupRouter)
router.use('/categories', categoryRouter)
router.use('/questionAnswers', questionAnswersRouter)
router.use('/questions', questionsRouter)
router.use('/catalogs', catalogRouter)
router.use('/cognito', cognitoRouter)

export { router as apiRouter }
