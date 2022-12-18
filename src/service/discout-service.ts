import { Document, Types } from "mongoose"
import BranchModel from "../models/BranchModel.js";
import { IService } from "../models/ServiceModel.js"
import { checkBirthdayRange, checkRequiredNumberOfVisits, getDiscountedPrice } from "../utils/discount.js";
import { verifyJwt } from "../utils/jwt.js"


type DiscountType = '' | 'Скидка в день рождения' | 'Скидка за посещения'

interface IDiscountedService {
    _id: Types.ObjectId
    title: string
    duration: number
    price: number
    description: string
    avatar_url: string
    branch_id: Types.ObjectId
    master_ids: Types.DocumentArray<Types.ObjectId>
    is_deleted: boolean
    has_discount: boolean
    discount_type: DiscountType
    discount_price: number
}

class DiscountService {
    getServicesWithDiscount = async (
        services: (Document<unknown, unknown, IService> & IService & {
            _id: Types.ObjectId;
        })[],
        customer_token: string,
        branchId: string
    ): Promise<IDiscountedService[]> => {

        const branch = await BranchModel.findById(branchId)
        if (customer_token && branch) {
            const customer = verifyJwt(customer_token)
            const isBirthdayRange = await checkBirthdayRange(customer.id, branch.birthday_discount_settings.days_before, branch.birthday_discount_settings.days_after)
            const isRequiredNumberOfVisits = await checkRequiredNumberOfVisits(customer.id, branch.discount_settings.time_in_days, branch.discount_settings.visits)

            return services.map(service => {
                const birthdayDiscountIsAvailable = branch.birthday_discount_settings.services.some(discountService => discountService._id.toString() === service._id.toString())
                const discountIsAvailable = branch.discount_settings.services.some(discountService => discountService._id.toString() === service._id.toString())

                return {
                    _id: service._id,
                    title: service.title,
                    duration: service.duration,
                    price: service.price,
                    description: service.description,
                    avatar_url: service.avatar_url,
                    branch_id: service.branch_id,
                    master_ids: service.master_ids,
                    is_deleted: service.is_deleted,
                    has_discount: branch.discount_priority === 'birthday'
                        ? birthdayDiscountIsAvailable
                            ? isBirthdayRange
                                ? true
                                : false
                            : discountIsAvailable
                                ? isRequiredNumberOfVisits
                                    ? true
                                    : false
                                : false
                        : discountIsAvailable
                            ? isRequiredNumberOfVisits
                                ? true
                                : false
                            : birthdayDiscountIsAvailable
                                ? isBirthdayRange
                                    ? true
                                    : false
                                : false,
                    discount_type: branch.discount_priority === 'birthday'
                        ? birthdayDiscountIsAvailable
                            ? isBirthdayRange
                                ? 'Скидка в день рождения'
                                : ''
                            : discountIsAvailable
                                ? isRequiredNumberOfVisits
                                    ? 'Скидка за посещения'
                                    : ''
                                : ''
                        : discountIsAvailable
                            ? isRequiredNumberOfVisits
                                ? 'Скидка за посещения'
                                : ''
                            : birthdayDiscountIsAvailable
                                ? isBirthdayRange
                                    ? 'Скидка в день рождения'
                                    : ''
                                : '',
                    discount_price: branch.discount_priority === 'birthday'
                        ? birthdayDiscountIsAvailable
                            ? isBirthdayRange
                                ? getDiscountedPrice(service.price, branch.birthday_discount_settings.percent)
                                : 0
                            : discountIsAvailable
                                ? isRequiredNumberOfVisits
                                    ? getDiscountedPrice(service.price, branch.discount_settings.percent)
                                    : 0
                                : 0
                        : discountIsAvailable
                            ? isRequiredNumberOfVisits
                                ? getDiscountedPrice(service.price, branch.discount_settings.percent)
                                : 0
                            : birthdayDiscountIsAvailable
                                ? isBirthdayRange
                                    ? getDiscountedPrice(service.price, branch.birthday_discount_settings.percent)
                                    : 0
                                : 0
                }
            })
        } else {
            return services.map(service => {
                return {
                    _id: service._id,
                    title: service.title,
                    duration: service.duration,
                    price: service.price,
                    description: service.description,
                    avatar_url: service.avatar_url,
                    branch_id: service.branch_id,
                    master_ids: service.master_ids,
                    is_deleted: service.is_deleted,
                    has_discount: false,
                    discount_type: '',
                    discount_price: 0
                }
            })
        }
    }
}

export default new DiscountService()