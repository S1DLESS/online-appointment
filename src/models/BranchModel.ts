import { Schema, model, Types } from 'mongoose'

interface ITime {
    hours: number
    minutes: number
}

interface IAppointmentSettings {
    available_days: number
    timezone: string
    start_time: ITime
    end_time: ITime
    interval: number
}

interface IDiscountSettings {
    is_enabled: boolean
    visits: number
    time_in_days: number
    percent: number
    services: Types.Array<Types.ObjectId>
}

interface IBirthdayDiscountSettings {
    is_enabled: boolean
    days_before: number
    days_after: number
    percent: number
    services: Types.Array<Types.ObjectId>
}

interface IBackground {
    type: string
    src: string
}

interface IFormSettings {
    background: IBackground
    main_color: string
}

type DiscountPriority = 'birthday' | 'visits'

interface IBranch {
    title: string
    type: string
    description: string
    address: string
    phone: number
    company_id: Types.ObjectId
    appointment_settings: IAppointmentSettings
    discount_priority: DiscountPriority
    discount_settings: IDiscountSettings
    birthday_discount_settings: IBirthdayDiscountSettings
    form_settings: IFormSettings
}

const branchSchema = new Schema<IBranch>({
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: String,
    address: String,
    phone: Number,
    company_id: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    appointment_settings: {
        available_days: { type: Number, default: 30, required: true },
        timezone: { type: String, default: 'GMT+03:00', required: true },
        start_time: {
            hours: { type: Number, default: 9, required: true },
            minutes: { type: Number, default: 0, required: true }
        },
        end_time: {
            hours: { type: Number, default: 21, required: true },
            minutes: { type: Number, default: 0, required: true }
        },
        interval: { type: Number, default: 900000, required: true }
    },
    discount_priority: { type: String, default: 'birthday', require: true },
    discount_settings: {
        is_enabled: { type: Boolean, default: false, required: true },
        visits: { type: Number, default: 0, required: true },
        time_in_days: { type: Number, default: 0, required: true },
        percent: { type: Number, default: 0, required: true },
        services: [{ type: Schema.Types.ObjectId, ref: "Service", required: true }]
    },
    birthday_discount_settings: {
        is_enabled: { type: Boolean, default: false, required: true },
        days_before: { type: Number, default: 7, required: true },
        days_after: { type: Number, default: 7, required: true },
        percent: { type: Number, default: 0, required: true },
        services: [{ type: Schema.Types.ObjectId, ref: "Service", required: true }]
    },
    form_settings: {
        background: {
            type: { type: String, default: 'color', required: true },
            src: { type: String, default: '#f4f6f8', required: true }
        },
        main_color: { type: String, default: '#00AB55', required: true }
    }
})

export default model<IBranch>("Branch", branchSchema)