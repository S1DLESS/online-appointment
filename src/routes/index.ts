import Router from 'express'
import userRouter from './userRouter.js'
import masterRouter from './masterRouter.js'
import serviceRouter from './serviceRouter.js'
import recordRouter from './recordRouter.js'
import branchRouter from './branchRouter.js'
import clientRouter from './clientRouter.js'
import customerRouter from './customerRouter.js'


const router = Router()

router.use('/user', userRouter)
router.use('/master', masterRouter)
router.use('/service', serviceRouter)
router.use('/record', recordRouter)
router.use('/branch', branchRouter)
router.use('/client', clientRouter)
router.use('/customer', customerRouter)

export default router
