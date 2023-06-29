import express from 'express'
import { adminRouter } from './admin'
import { catalogRouter } from './catalog'
import { categoryRouter } from './categories'
import { cognitoRouter } from './cognito'
import { groupLeaderRouter } from './group-leader'
import { questionAnswersRouter } from './question-answers'
import { questionsRouter } from './questions'
import { superAdminRouter } from './super-admin'
import { userRouter } from './user'

const router = express.Router()

router.use('/super', superAdminRouter)
router.use('/admin', adminRouter)
router.use('/categories', categoryRouter)
router.use('/question-answers', questionAnswersRouter)
router.use('/questions', questionsRouter)
router.use('/catalogs', catalogRouter)
router.use('/cognito', cognitoRouter)
router.use('/group-leader', groupLeaderRouter)
router.use('/user', userRouter)

export { router as apiRouter }
