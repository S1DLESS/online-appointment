import { Types } from 'mongoose'
import CustomerModel from '../models/CustomerModel.js'
import RecordModel from '../models/RecordModel.js'


export const checkBirthdayRange = async (
    customerId: string | Types.ObjectId,
    daysBefore: number,
    daysAfter: number,
) => {
    const customer = await CustomerModel.findById(customerId)
    if (customer) {
        const birthday = {
            day: customer.birthdate.getDate(),
            month: customer.birthdate.getMonth(),
        }
        const before = {
            day: new Date(new Date().setDate(new Date().getDate() - daysBefore)).getDate(),
            month: new Date(new Date().setDate(new Date().getDate() - daysBefore)).getMonth(),
        }
        const after = {
            day: new Date(new Date().setDate(new Date().getDate() + daysAfter)).getDate(),
            month: new Date(new Date().setDate(new Date().getDate() + daysAfter)).getMonth(),
        }
        return (
            before.day <= birthday.day &&
            before.month <= birthday.month &&
            birthday.day <= after.day &&
            birthday.month <= after.month
        )
    } else {
        return false
    }
}

export const checkRequiredNumberOfVisits = async (
    customerId: string | Types.ObjectId,
    days: number,
    visits: number,
) => {
    const records = await RecordModel.find({
        customer_id: customerId,
        date: {
            $gte: new Date(new Date().setDate(new Date().getDate() - days)),
            $lt: new Date(),
        },
    })
    return records.length >= visits
}

export const getDiscountedPrice = (price: number, percent: number) => {
    return price - (price / 100) * percent
}
