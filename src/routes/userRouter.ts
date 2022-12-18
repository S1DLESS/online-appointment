import Router from 'express'
import userController from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/reset', userController.reset)
router.post('/reset-password/:token', userController.updatePassword)
router.get('/activate/:link', userController.activate)
router.get('/auth', authMiddleware, userController.checkTokenAndLoadData)
router.get('/branchdata/:id', authMiddleware, userController.branchdata)
router.put('/edituser/:id', authMiddleware, userController.edituser)
router.put('/editcompany/:id', authMiddleware, userController.editcompany)
router.post('/deleteaccount/:id', authMiddleware, userController.deleteAccount)

export default router