import express from 'express'
import { adminRouter } from './admin/router'
import { catalogRouter } from './catalog/router'
import { categoryRouter } from './categories/router'
import { cognitoRouter } from './cognito/router'
import { debugRouter } from './debug/debugRouter'
import { groupLeaderRouter } from './group-leader/router'
import { groupRouter } from './groups/router'
import { organizationRouter } from './organizations/router'
import { questionAnswersRouter } from './question-answers/router'
import { questionsRouter } from './questions/router'
import { superAdminRouter } from './super-admin/router'
import { userRouter } from './user/router'

const router = express.Router()

router.use('/super', superAdminRouter)
router.use('/admin', adminRouter)
router.use('/debug', debugRouter)
router.use('/organizations', organizationRouter)
router.use('/groups', groupRouter)
router.use('/categories', categoryRouter)
router.use('/question-answers', questionAnswersRouter)
router.use('/questions', questionsRouter)
router.use('/catalogs', catalogRouter)
router.use('/cognito', cognitoRouter)
router.use('/group-leader', groupLeaderRouter)
router.use('/user', userRouter)

export { router as apiRouter }
