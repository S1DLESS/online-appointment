import ApiError from "../error/ApiError.js"
import RecordModel from "../models/RecordModel.js"
import BranchModel from "../models/BranchModel.js"
import CustomerModel from "../models/CustomerModel.js"
import mailService from "../service/mail-service.js"
import { Request, Response, NextFunction } from "express"


class RecordController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const branch_id = req.headers['x-branchid']
            const {
                name,
                email,
                phone,
                comment,
                date,
                master_id,
                service_id,
                is_service_discounted,
                discount_percent,
                discount_type
            } = req.body
            const {send_confirmation} = req.query

            const candidate = await CustomerModel.findOne({phone})
            if (candidate) {
                if (email) {
                    const isExistingEmail = candidate.email.some(existingEmail => existingEmail === email)
                    if (!isExistingEmail) {
                        candidate.email.push(email)
                        await candidate.save()
                    }
                }
                await RecordModel.create({
                    customer_id: candidate._id,
                    comment,
                    date,
                    branch_id,
                    master_id,
                    service_id,
                    is_service_discounted,
                    discount_percent,
                    discount_type
                })
            } else {
                const customer = await CustomerModel.create({
                    name,
                    email,
                    phone
                })
                await RecordModel.create({
                    customer_id: customer._id,
                    comment,
                    date,
                    branch_id,
                    master_id,
                    service_id,
                    is_service_discounted,
                    discount_percent,
                    discount_type
                })
            }

            if (send_confirmation) {
                const branch = await BranchModel.findById(branch_id)
                if (branch) {
                    await mailService.sendConfirmMail(email, branch.title, date)
                }
            }

            const records = await RecordModel.find({branch_id})

            return res.json({records})
        } catch (e) {
            next(ApiError.notFound('Create-records-error', e))
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const branch_id = req.headers['x-branchid']

            await RecordModel.updateOne({_id: req.params.id}, {
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                comment: req.body.comment,
                date: req.body.date,
                branch_id,
                master_id: req.body.masterId,
                service_id: req.body.serviceId,
                is_service_discounted: req.body.is_service_discounted,
                discount_percent: req.body.discount_percent,
                discount_type: req.body.discount_type
            })

            const records = await RecordModel.find({branch_id})

            return res.json({records})
        } catch (e) {
            next(ApiError.notFound('Update-records-error', e))
        }
    }

    async delete(req: Request<{id: string}>, res: Response, next: NextFunction) {
        try {
            const branch_id = req.headers['x-branchid']
            const {id} = req.params

            await RecordModel.findByIdAndDelete(id)

            const records = await RecordModel.find({branch_id})

            return res.json({records})
        } catch (e) {
            next(ApiError.notFound('Delete-records-error', e))
        }
    }
}

export default new RecordController()