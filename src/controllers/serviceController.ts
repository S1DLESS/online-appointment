import ApiError from '../error/ApiError.js'
import MasterModel from '../models/MasterModel.js'
import ServiceModel from '../models/ServiceModel.js'
import { getArrayChanges } from '../utils/index.js'
import AppointmentFiltration from '../service/AppointmentFiltration/index.js'
import { NextFunction, Request, Response } from 'express'
import DiscountService from '../service/discout-service.js'
import FileService from '../service/file-service.js'


export interface IGetServicesQuery {
    master_id: string
    customer_token: string
    date: string
}

class ServiceController {
    async get(
        req: Request<unknown, unknown, unknown, IGetServicesQuery>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const branch_id = (req.headers['x-branchid'] || '') as string
            const { master_id, customer_token } = req.query
            const date = +req.query.date ? new Date(+req.query.date) : null

            const availableServices = await AppointmentFiltration.getServices(branch_id, master_id, date)

            const services = await DiscountService.getServicesWithDiscount(availableServices, customer_token, branch_id)


            return res.json({ services })
        } catch (e) {
            next(ApiError.notFound('Get-service-error', e))
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const branch_id = req.headers['x-branchid']
            const avatar = req.files && req.files.avatar
            const master_ids = req.body.master_ids
                ? typeof req.body.master_ids === 'string'
                    ? [req.body.master_ids]
                    : req.body.master_ids
                : []

            let avatar_url = ''
            if (avatar && !Array.isArray(avatar)) {
                avatar_url = FileService.add(avatar, 'service')
            }

            const service = await ServiceModel.create({
                title: req.body.title,
                duration: req.body.duration,
                price: req.body.price,
                description: req.body.description,
                avatar_url,
                branch_id,
                master_ids
            })

            const services = await ServiceModel.find({ branch_id })

            if (master_ids.length) {
                await MasterModel.updateMany({ _id: master_ids }, { "$push": { service_ids: service._id } })
                const masters = await MasterModel.find({ branch_id })
                return res.json({ services, masters })
            } else {
                return res.json({ services })
            }
        } catch (e) {
            next(ApiError.notFound('Create-service-error', e))
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const branch_id = req.headers['x-branchid']
            const master_ids = req.body.master_ids
                ? typeof req.body.master_ids === 'string'
                    ? [req.body.master_ids]
                    : req.body.master_ids
                : []
            const avatar = req.files ? req.files.avatar : null
            const service = await ServiceModel.findById(req.params.id)

            if (service) {
                let avatar_url = service.avatar_url
                if (avatar && !Array.isArray(avatar)) {
                    if (avatar_url) {
                        FileService.delete(avatar_url, 'service')
                    }
                    avatar_url = FileService.add(avatar, 'service')
                }

                await ServiceModel.updateOne({ _id: req.params.id }, {
                    title: req.body.title,
                    duration: req.body.duration,
                    price: req.body.price,
                    description: req.body.description,
                    avatar_url,
                    branch_id,
                    master_ids
                })

                const services = await ServiceModel.find({ branch_id })
                const masterIds = service.master_ids.map(id => id.toString())
                const masterIdsChanges = getArrayChanges(masterIds, master_ids)
                if (masterIdsChanges.length) {
                    const added = masterIdsChanges.filter(el => el.type === 'added')
                    const removed = masterIdsChanges.filter(el => el.type === 'removed')
                    await MasterModel.updateMany({ _id: added.map(el => el.value) }, { "$push": { service_ids: service._id } })
                    await MasterModel.updateMany({ _id: removed.map(el => el.value) }, { "$pull": { service_ids: service._id } })
                    const masters = await MasterModel.find({ branch_id })
                    return res.json({ services, masters })
                } else {
                    return res.json({ services })
                }
            } else {
                next(ApiError.badRequest(`Услуга не найдена`))
            }

        } catch (e) {
            next(ApiError.notFound('Update-service-error', e))
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const branch_id = req.headers['x-branchid']
            const service = await ServiceModel.findByIdAndDelete(req.params.id)

            if (service) {
                if (service.avatar_url) {
                    FileService.delete(service.avatar_url, 'service')
                }

                const services = await ServiceModel.find({ branch_id })

                if (service.master_ids.length) {
                    await MasterModel.updateMany({ _id: service.master_ids }, { "$pull": { service_ids: service._id } })
                    const masters = await MasterModel.find({ branch_id })
                    return res.json({ services, masters })
                } else {
                    return res.json({ services })
                }
            } else {
                next(ApiError.badRequest(`Услуга не найдена`))
            }
        } catch (e) {
            next(ApiError.notFound('Delete-service-error', e))
        }
    }
}

export default new ServiceController()