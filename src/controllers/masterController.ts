import ApiError from '../error/ApiError.js'
import MasterModel from '../models/MasterModel.js'
import ServiceModel from '../models/ServiceModel.js'
import { getArrayChanges } from '../utils/index.js'
import AppointmentFiltration from '../service/AppointmentFiltration/index.js'
import { NextFunction, Request, Response } from 'express'
import FileService from '../service/file-service.js'


export interface IGetMastersQuery {
    service_id: string
    date: string
}

class MasterController {
    async get(
        req: Request<unknown, unknown, unknown, IGetMastersQuery>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const branch_id = (req.headers['x-branchid'] || '') as string
            const { service_id } = req.query
            const date = +req.query.date ? new Date(+req.query.date) : null

            const masters = await AppointmentFiltration.getMasters(branch_id, service_id, date)

            return res.json({ masters })
        } catch (e) {
            next(ApiError.notFound('Get-master-error', e))
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const branch_id = req.headers['x-branchid']
            const avatar = req.files && req.files.avatar
            const service_ids = req.body.service_ids
                ? typeof req.body.service_ids === 'string'
                    ? [req.body.service_ids]
                    : req.body.service_ids
                : []

            let avatar_url = ''
            if (avatar && !Array.isArray(avatar)) {
                avatar_url = FileService.add(avatar, 'master')
            }

            const master = await MasterModel.create({
                name: req.body.name,
                description: req.body.description,
                position: req.body.position,
                avatar_url,
                branch_id,
                service_ids
            })

            const masters = await MasterModel.find({ branch_id })

            if (service_ids.length) {
                await ServiceModel.updateMany({ _id: service_ids }, { "$push": { master_ids: master._id } })
                const services = await ServiceModel.find({ branch_id })
                return res.json({ masters, services })
            } else {
                return res.json({ masters })
            }
        } catch (e) {
            next(ApiError.notFound('Create-master-error', e))
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const branch_id = req.headers['x-branchid']
            const service_ids = req.body.service_ids
                ? typeof req.body.service_ids === 'string'
                    ? [req.body.service_ids]
                    : req.body.service_ids
                : []
            const avatar = req.files && req.files.avatar
            const master = await MasterModel.findById(req.params.id)

            if (master) {
                let avatar_url = master.avatar_url
                if (avatar && !Array.isArray(avatar)) {
                    if (avatar_url) {
                        FileService.delete(avatar_url, 'master')
                    }
                    avatar_url = FileService.add(avatar, 'master')
                }

                await MasterModel.updateOne({ _id: req.params.id }, {
                    name: req.body.name,
                    description: req.body.description,
                    position: req.body.position,
                    avatar_url,
                    branch_id,
                    service_ids
                })

                const masters = await MasterModel.find({ branch_id })
                const serviceIds = master.service_ids.map(id => id.toString())
                const serviceIdsChanges = getArrayChanges(serviceIds, service_ids)
                if (serviceIdsChanges.length) {
                    const added = serviceIdsChanges.filter(el => el.type === 'added')
                    const removed = serviceIdsChanges.filter(el => el.type === 'removed')
                    await ServiceModel.updateMany({ _id: added.map(el => el.value) }, { "$push": { master_ids: master._id } })
                    await ServiceModel.updateMany({ _id: removed.map(el => el.value) }, { "$pull": { master_ids: master._id } })
                    const services = await ServiceModel.find({ branch_id })
                    return res.json({ masters, services })
                } else {
                    return res.json({ masters })
                }
            }
        } catch (e) {
            next(ApiError.notFound('Update-master-error', e))
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const branch_id = req.headers['x-branchid']
            const master = await MasterModel.findByIdAndDelete(req.params.id)

            if (master) {
                FileService.delete(master.avatar_url, 'master')

                const masters = await MasterModel.find({ branch_id })

                if (master.service_ids.length) {
                    await ServiceModel.updateMany({ _id: master.service_ids }, { "$pull": { master_ids: master._id } })
                    const services = await ServiceModel.find({ branch_id })
                    return res.json({ masters, services })
                } else {
                    return res.json({ masters })
                }
            }
        } catch (e) {
            next(ApiError.notFound('Delete-master-error', e))
        }
    }
}

export default new MasterController()