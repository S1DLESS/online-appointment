import Router from 'express'
import serviceController, { IGetServicesQuery } from '../controllers/serviceController.js'
import branchCheckMiddleware from '../middleware/branchCheckMiddleware.js'


const router = Router()

router.get<'/', unknown, unknown, unknown, IGetServicesQuery>('/', branchCheckMiddleware, serviceController.get)
router.post('/', branchCheckMiddleware, serviceController.create)
router.put('/:id', branchCheckMiddleware, serviceController.update)
router.delete('/:id', branchCheckMiddleware, serviceController.delete)

export default router