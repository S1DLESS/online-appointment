import { Router } from "express"
import branchController from "../controllers/branchController.js"
import authMiddleware from "../middleware/authMiddleware.js"


const router = Router()

router.get('/', branchController.getMany)
router.get('/:id', branchController.getOne)
router.post('/', authMiddleware, branchController.create)
router.put('/:id', authMiddleware, branchController.update)
router.put('/:id/form', authMiddleware, branchController.updateForm)
router.put('/:id/appointment', authMiddleware, branchController.updateAppointment)
router.delete('/:id', authMiddleware, branchController.delete)

export default router