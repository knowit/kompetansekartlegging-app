import express from 'express'
import {
  adminRouter,
  catalogsRouter,
  categoriesRouter,
  cognitoRouter,
  groupLeaderRouter,
  questionAnswersRouter,
  questionsRouter,
  superAdminRouter,
  userRouter,
} from '.'

const router = express.Router()

router.use('/super', superAdminRouter)
router.use('/admin', adminRouter)
router.use('/categories', categoriesRouter)
router.use('/question-answers', questionAnswersRouter)
router.use('/questions', questionsRouter)
router.use('/catalogs', catalogsRouter)
router.use('/cognito', cognitoRouter)
router.use('/group-leader', groupLeaderRouter)
router.use('/user', userRouter)

export { router as apiRouter }
