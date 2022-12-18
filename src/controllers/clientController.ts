import { NextFunction, Request, Response } from 'express'
import ApiError from '../error/ApiError.js'
import AppointmentFiltration from '../service/AppointmentFiltration/index.js'


interface ITimeSlotsQuery {
    date: string
    master_id: string
    service_id: string
}

interface ITimeSlotsResBody {
    timeArr: string[]
}

interface IUnavailableDatesQuery {
    master_id: string
    service_id: string
}

interface IUnavailableDatesResBody {
    unavailableDates: Date[]
    maxDate: Date
}

class ClientController {
    async getTimeSlots(
        req: Request<unknown, unknown, unknown, ITimeSlotsQuery>,
        res: Response<ITimeSlotsResBody>,
        next: NextFunction
    ) {
        try {
            const branch_id = (req.headers['x-branchid'] || '') as string
            const { date, master_id, service_id } = req.query
            const day = new Date(+date)

            const timeArr = await AppointmentFiltration.getTimeSlots(branch_id, master_id, service_id, day)

            return res.json({ timeArr })
        } catch (e) {
            next(ApiError.notFound('GetTimeSlots-client-error', e))
        }
    }

    async getUnavailableDates(
        req: Request<unknown, unknown, unknown, IUnavailableDatesQuery>,
        res: Response<IUnavailableDatesResBody>,
        next: NextFunction) {
        try {
            const branch_id = (req.headers['x-branchid'] || '') as string
            const { master_id, service_id } = req.query

            const unavailableDates = await AppointmentFiltration.getUnavailableDates(branch_id, master_id, service_id)

            return res.json(unavailableDates)
        } catch (e) {
            next(ApiError.notFound('GetUnavailableDates-client-error', e))
        }
    }
}

export default new ClientController()