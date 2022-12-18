import Router from 'express'
import masterController, { IGetMastersQuery } from '../controllers/masterController.js'
import branchCheckMiddleware from '../middleware/branchCheckMiddleware.js'


const router = Router()

router.get<'/', unknown, unknown, unknown, IGetMastersQuery>('/', branchCheckMiddleware, masterController.get)
router.post('/', branchCheckMiddleware, masterController.create)
router.put('/:id', branchCheckMiddleware, masterController.update)
router.delete('/:id', branchCheckMiddleware, masterController.delete)

export default router