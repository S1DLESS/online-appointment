import Router from 'express'
import clientController from '../controllers/clientController.js'


const router = Router()

router.get('/time', clientController.getTimeSlots)
router.get('/date', clientController.getUnavailableDates)

export default router