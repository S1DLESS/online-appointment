import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import ApiError from '../error/ApiError.js'
import UserModel from '../models/UserModel.js'
import CompanyModel from '../models/CompanyModel.js'
import BranchModel from '../models/BranchModel.js'
import MasterModel from '../models/MasterModel.js'
import ServiceModel from '../models/ServiceModel.js'
import RecordModel from '../models/RecordModel.js'
import CustomerModel from '../models/CustomerModel.js'
import mailService from '../service/mail-service.js'
import { NextFunction, Request, Response } from 'express'
import { generateJwt, verifyJwt } from '../utils/jwt.js'


class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                username,
                email,
                password,
                companyTitle,
                companyDescription,
                branchTitle,
                branchType,
                branchDescription,
                branchAddress,
                branchPhone,
            } = req.body
            if (!email || !password || !companyTitle) {
                return next(ApiError.badRequest("Некорректный email, пароль или название компании"))
            }
            const candidate = await UserModel.findOne({email})
            if (candidate) {
                return next(ApiError.badRequest("Пользователь с таким email уже существует"))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const activationLink = uuidv4()
            await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`)
            const company = await CompanyModel.create({
                title: companyTitle,
                description: companyDescription,
            })
            const user = await UserModel.create({
                name: username,
                email,
                password: hashPassword,
                activation_link: activationLink,
                company_id: company._id
            })
            await BranchModel.create({
                title: branchTitle,
                type: branchType,
                description: branchDescription,
                address: branchAddress,
                phone: branchPhone,
                company_id: company._id})
            const token = generateJwt(user._id.toString(), user.email, '24h')
            return res.json({token})
        } catch (e) {
            next(ApiError.notFound('Registration-user-error', e))
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activation_link = req.params.link;
            const user = await UserModel.findOne({activation_link})
            if (!user) {
                return next(ApiError.badRequest("Неккоректная ссылка активации"))
            }
            user.is_activated = true;
            await user.save()

            return res.redirect(`${process.env.CLIENT_URL}/admin/account-verified`)
        } catch (e) {
            next(ApiError.notFound('Activate-user-error', e))
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body
            const user = await UserModel.findOne({email})
            if (!user) {
                return next(ApiError.internalServerError('Пользователь не найден'))
            }
            const comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.internalServerError('Указан неверный пароль'))
            }
            const token = generateJwt(user._id.toString(), user.email, '24h')
            return res.json({token})
        } catch (e) {
            next(ApiError.notFound('Login-user-error', e))
        }
    }

    async reset(req: Request, res: Response, next: NextFunction) {
        try {
            const {email} = req.body
            const user = await UserModel.findOne({email})
            if (!user) {
                return next(ApiError.internalServerError('Пользователь не найден'))
            }
            const token = generateJwt(user._id.toString(), user.email, '5m')
            await mailService.sendResetPasswordMail(email, `${process.env.CLIENT_URL}/admin/new-password/${token}`)
            return res.json({ok: true})
        } catch (e) {
            next(ApiError.notFound('Reset-user-error', e))
        }
    }

    async updatePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const {password} = req.body
            const token = req.params.token
            const {id} = verifyJwt(token)
            const user = await UserModel.findById(id)
            if (!user) {
                return next(ApiError.badRequest("Пользователя не существует"))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            user.password = hashPassword
            await user.save()

            const newToken = generateJwt(user._id.toString(), user.email, '24h')
            return res.json({token: newToken})
        } catch (e) {
            next(ApiError.unauthorized("Ошибка в токене"))
        }
    }

    
    async checkTokenAndLoadData(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user) {
                const token = generateJwt(req.user.id, req.user.email, '24h')

                const user = await UserModel.findById(req.user.id, '-password')
                if (!user) {
                    return next(ApiError.badRequest('Не найден пользователь'))
                }
                const company = await CompanyModel.findById(user.company_id)
                if (company) {
                    const branches = await BranchModel.find({company_id: company._id})
                    return res.json({token, data: {user, company, branches}})
                } else {
                    next(ApiError.badRequest(`Компания не найдена`))
                }
            }
        } catch (e) {
            next(ApiError.notFound('CheckTokenAndLoadData-user-error', e))
        }
    }

    async branchdata(req: Request, res: Response, next: NextFunction) {
        try {
            const masters = await MasterModel.find({branch_id: req.params.id})
            const services = await ServiceModel.find({branch_id: req.params.id})
            const records = await RecordModel.find({branch_id: req.params.id})
            const customers = await CustomerModel.find({_id: records.map(record => record.customer_id)})

            return res.json({masters, services, records, customers})
        } catch (e) {
            next(ApiError.notFound('BranchData-user-error', e))
        }
    }

    async edituser(req: Request, res: Response, next: NextFunction) {
        try {
                await UserModel.findByIdAndUpdate({_id: req.params.id}, req.body.password
                    ? {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    }
                    : {
                        name: req.body.name,
                        email: req.body.email
                    }    
                )
    
                const user = await UserModel.findById(req.params.id, '-password')
    
                return res.json({user})
        } catch (e) {
            next(ApiError.notFound('EditUser-user-error', e))
        }
    }

    async editcompany(req: Request, res: Response, next: NextFunction) {
        try {
            await CompanyModel.findByIdAndUpdate({_id: req.params.id}, {
                title: req.body.title,
                description: req.body.description
            })

            const company = await CompanyModel.findById(req.params.id)

            return res.json({company})
        } catch (e) {
            next(ApiError.notFound('EditCompany-user-error', e))
        }
    }

    async deleteAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserModel.findById(req.params.id)
            if (!user) {
                return next(ApiError.internalServerError('Пользователь не найден'))
            }
            const comparePassword = bcrypt.compareSync(req.body.password, user.password)
            if (!comparePassword) {
                return next(ApiError.internalServerError('Указан неверный пароль'))
            }
            await UserModel.findByIdAndDelete(req.params.id)
            const company = await CompanyModel.findByIdAndDelete(user.company_id)
            if (!company) {
                return next(ApiError.badRequest(`Компания не найдена`))
            }
            const branches = await BranchModel.find({company_id: company._id})
            await BranchModel.deleteMany({company_id: company._id})
            await MasterModel.deleteMany({branch_id: branches.map(el => el._id)})
            await ServiceModel.deleteMany({branch_id: branches.map(el => el._id)})
            const records = await RecordModel.find({branch_id: branches.map(el => el._id)})
            const customerIds = records.map(record => record.customer_id)
            await RecordModel.deleteMany({branch_id: branches.map(el => el._id)})
            await CustomerModel.deleteMany({_id: customerIds})

            return res.json({ok: true})
        } catch (e) {
            next(ApiError.notFound('Delete-user-error', e))
        }
    }
}

export default new UserController()