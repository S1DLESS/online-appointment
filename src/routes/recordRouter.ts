import Router from 'express'
import recordController from '../controllers/recordController.js'
import branchCheckMiddleware from '../middleware/branchCheckMiddleware.js'


const router = Router()

router.post('/', branchCheckMiddleware, recordController.create)
router.put('/:id', branchCheckMiddleware, recordController.update)
router.delete('/:id', branchCheckMiddleware, recordController.delete)

export default router