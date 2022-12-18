import ApiError from '../error/ApiError.js'
import BranchModel from '../models/BranchModel.js'
import { NextFunction, Request, Response } from 'express'
import FileService from '../service/file-service.js'


class BranchController {
    async getMany(req: Request, res: Response, next: NextFunction) {
        try {
            const branches = await BranchModel.find()
            return res.json({ branches })
        } catch (e) {
            next(ApiError.notFound('GetMany-branch-error', e))
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const branch = await BranchModel.findById(req.params.id)
            return res.json({ branch })
        } catch (e) {
            next(ApiError.notFound('GetOne-branch-error', e))
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            await BranchModel.create({
                title: req.body.title,
                type: req.body.type,
                description: req.body.description,
                address: req.body.address,
                phone: req.body.phone,
                company_id: req.body.company_id,
                appointment_settings: {
                    start_time: {
                        hours: req.body.start_hours,
                        minutes: req.body.start_minutes
                    },
                    end_time: {
                        hours: req.body.end_hours,
                        minutes: req.body.end_minutes
                    }
                }
            })

            const branches = await BranchModel.find({ company_id: req.body.company_id })

            return res.json({ branches })
        } catch (e) {
            next(ApiError.notFound('Create-branch-error', e))
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const isDiscountUpdate = req.query.discount

            const a = {
                discount_settings: {
                    is_enabled: req.body.discount_settings.is_enabled,
                    visits: req.body.discount_settings.visits,
                    time_in_days: req.body.discount_settings.time_in_days,
                    percent: req.body.discount_settings.percent,
                    services: req.body.discount_settings.services
                },
                birthday_discount_settings: {
                    is_enabled: req.body.birthday_discount_settings.is_enabled,
                    days_before: req.body.birthday_discount_settings.days_before,
                    days_after: req.body.birthday_discount_settings.days_after,
                    percent: req.body.birthday_discount_settings.percent,
                    services: req.body.birthday_discount_settings.services
                }
            }
            const b = {
                title: req.body.title,
                type: req.body.type,
                description: req.body.description,
                address: req.body.address,
                phone: req.body.phone,
                appointment_settings: {
                    start_time: {
                        hours: req.body.start_hours,
                        minutes: req.body.start_minutes
                    },
                    end_time: {
                        hours: req.body.end_hours,
                        minutes: req.body.end_minutes
                    }
                }
            }

            const branch = await BranchModel.findByIdAndUpdate(
                { _id: req.params.id },
                isDiscountUpdate ? a : b
            )

            if (branch) {
                const branches = await BranchModel.find({ company_id: branch.company_id })
                return res.json({ branches })
            } else {
                next(ApiError.badRequest(`Филиал не найден`))
            }
        } catch (e) {
            next(ApiError.notFound('Update-branch-error', e))
        }
    }

    async updateForm(req: Request, res: Response, next: NextFunction) {
        try {
            const bgImage = req.files && req.files.bgImage
            const { bgColor, main_color } = req.body

            const branch = await BranchModel.findById(req.params.id)

            if (branch && branch.form_settings.background.type === 'image') {
                FileService.delete(branch.form_settings.background.src, 'formBackground')
            }

            let bg_url = ''
            if (bgImage && !Array.isArray(bgImage)) {
                bg_url = FileService.add(bgImage, 'formBackground')
            }

            await BranchModel.updateOne({ _id: req.params.id }, {
                form_settings: {
                    background: {
                        type: bgImage ? 'image' : 'color',
                        src: bgImage ? bg_url : bgColor
                    },
                    main_color
                }
            })

            if (branch) {
                const branches = await BranchModel.find({ company_id: branch.company_id })
                return res.json({ branches })
            } else {
                next(ApiError.badRequest(`Филиал не найден`))
            }
        } catch (e) {
            next(ApiError.notFound('UpdateForm-branch-error', e))
        }
    }

    async updateAppointment(req: Request, res: Response, next: NextFunction) {
        try {
            const { timezone, available_days, interval, start_time, end_time } = req.body

            const branch = await BranchModel.findByIdAndUpdate(req.params.id, {
                appointment_settings: {
                    timezone,
                    available_days,
                    interval,
                    start_time,
                    end_time
                }
            })

            if (branch) {
                const branches = await BranchModel.find({ company_id: branch.company_id })
                return res.json({ branches })
            } else {
                next(ApiError.badRequest(`Филиал не найден`))
            }
        } catch (e) {
            next(ApiError.notFound('UpdateAppointment-branch-error', e))
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const branch = await BranchModel.findByIdAndDelete(req.params.id)
            if (branch) {
                const branches = await BranchModel.find({ company_id: branch.company_id })
                return res.json({ branches })
            } else {
                next(ApiError.badRequest(`Филиал не найден`))
            }
        } catch (e) {
            next(ApiError.notFound('Delete-branch-error', e))
        }
    }
}

export default new BranchController()