import Router from 'express'
import customerController from '../controllers/customerController.js'


const router = Router()

router.get('/auth/code/:phone', customerController.getAuthCode)
router.post('/auth/code/:phone', customerController.sendAuthCode)
router.post('/auth/password', customerController.loginWithPassword)
router.get('/:token', customerController.getData)
router.get('/:id/records', customerController.getCustomerRecords)
router.post('/:id', customerController.update)

export default router