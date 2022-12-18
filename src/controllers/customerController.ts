import { v1 as uuidv1 } from 'uuid'
import bcrypt from 'bcrypt'
import ApiError from '../error/ApiError.js'
import CustomerModel from '../models/CustomerModel.js'
import RecordModel from '../models/RecordModel.js'
import ServiceModel from '../models/ServiceModel.js'
import MasterModel from '../models/MasterModel.js'
import { getDiscountedPrice } from '../utils/discount.js'
import { NextFunction, Request, Response } from 'express'
import { generateJwt, verifyJwt } from '../utils/jwt.js'


class CustomerController {
    
    async getAuthCode(req: Request, res: Response, next: NextFunction) {
        try {
            const {phone} = req.params

            const candidate = await CustomerModel.findOne({phone})
            if (!candidate) {
                next(ApiError.badRequest('Нет клиента с таким номером телефона'))
            }
            const code2 = uuidv1().match(/[0-9]/g) || []
            code2.splice(4, code2.length - 4)
            const code = code2.join("")
            
            await CustomerModel.updateOne({phone}, {
                $push: { auth_codes: { code, creation_date: new Date() } }
            })

            return res.json({ok: true, code})
        } catch (e) {
            next(ApiError.notFound('GetAuthCode-customer-error', e))
        }
    }

    async sendAuthCode(req: Request, res: Response, next: NextFunction) {
        try {
            const {phone} = req.params
            const {code} = req.body

            const customer = await CustomerModel.findOne({phone})
            if (!customer) {
                next(ApiError.badRequest('Нет клиента с таким номером телефона'))
            } else {
                const duration = 5 * 60 * 1000
                //если будет несколько одинаковых кодов
                const equivalentCodes = customer.auth_codes.filter(codeObj => codeObj.code === code)
                if (!equivalentCodes.length) {
                    next(ApiError.badRequest(`Неверный код`))
                }
                equivalentCodes.sort((a, b) => Date.parse(b.creation_date.toString()) - Date.parse(a.creation_date.toString()))
                const lastGeneratedCode = equivalentCodes[0]

                const isCodeValid = Date.parse(lastGeneratedCode.creation_date.toString()) + duration >= Date.parse(new Date().toString())
                if (isCodeValid) {
                    const token = generateJwt(customer._id.toString(), customer.email[0] || "")
                    const records = await RecordModel.find({branch_id: req.headers['x-branchid'], customer_id: customer._id})
                    return res.json({
                        token,
                        customer: {
                            _id: customer._id,
                            name: customer.name,
                            phone: customer.phone,
                            email: customer.email,
                            birthdate: customer.birthdate
                        },
                        records
                    })
                } else {
                    return res.json({message: 'Время действия кода истекло'})
                }
            }
        } catch (e) {
            next(ApiError.notFound('SetAuthCode-customer-error', e))
        }
    }

    async loginWithPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body

            const customer = await CustomerModel.findOne({email})
            if (!customer) {
                next(ApiError.badRequest('Нет такого клиента'))
            } else {
                const comparePassword = bcrypt.compareSync(password, customer.password)
                if (!comparePassword) {
                    return next(ApiError.internalServerError('Указан неверный пароль'))
                }
                const token = generateJwt(customer._id.toString(), email)
                const records = await RecordModel.find({branch_id: req.headers['x-branchid'], customer_id: customer._id})

                return res.json({
                    token,
                    customer: {
                        _id: customer._id,
                        name: customer.name,
                        phone: customer.phone,
                        email: customer.email,
                        birthdate: customer.birthdate
                    },
                    records
                })
            }
        } catch (e) {
            next(ApiError.notFound('LoginWithPassword-customer-error', e))
        }
    }

    async getData(req: Request, res: Response, next: NextFunction) {
        try {
            const {token} = req.params

            const {id} = verifyJwt(token)

            const customer = await CustomerModel.findById(id)
            if (!customer) {
                next(ApiError.badRequest('Нет такого клиента'))
            } else {
                const records = await RecordModel.find({branch_id: req.headers['x-branchid'], customer_id: customer._id})

                return res.json({
                    customer: {
                        _id: customer._id,
                        name: customer.name,
                        phone: customer.phone,
                        email: customer.email,
                        birthdate: customer.birthdate
                    },
                    records
                })
            }
        } catch (e) {
            next(ApiError.notFound('GetData-customer-error', e))
        }
    }

    async getCustomerRecords(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            const customerRecords = await RecordModel.find({customer_id: id})
            const masters = await MasterModel.find({_id: customerRecords.map(record => record.master_id)})
            const services = await ServiceModel.find({_id: customerRecords.map(record => record.service_id)})

            const records = customerRecords.map(record => {
                const master = masters.find(master => master._id.toString() === record.master_id.toString())
                const service = services.find(service => service._id.toString() === record.service_id.toString())
                return {
                    id: record._id.toString(),
                    date: Date.parse(record.date.toString()),
                    master: master ? master.name : record.master_id.toString(),
                    service: service ? service.title : record.service_id.toString(),
                    price: record.is_service_discounted
                        ? service
                            ? `${getDiscountedPrice(service.price, record.discount_percent)} руб. (${record.discount_type})`
                            : 0
                        : service
                            ? service.price
                            : 0,
                    comment: record.comment
                }
            })

            return res.json({records})
        } catch (e) {
            next(ApiError.notFound('GetCustomerRecords-customer-error', e))
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params
            const {birthdate, email, password} = req.body

            const hashPassword = await bcrypt.hash(password, 5)

            await CustomerModel.updateOne({_id: id}, {
                birthdate,
                email,
                password: password ? hashPassword : undefined
            })

            const customer = await CustomerModel.findById(id)
            if (customer) {
                return res.json({customer: {
                    _id: customer._id,
                    name: customer.name,
                    phone: customer.phone,
                    email: customer.email,
                    birthdate: customer.birthdate
                }})
            } else {
                next(ApiError.badRequest(`Клиент не найден`))
            }
            
        } catch (e) {
            next(ApiError.notFound('Update-customer-error', e))
        }
    }
}

export default new CustomerController()