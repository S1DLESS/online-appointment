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
    services: string[]
}

interface IBirthdayDiscountSettings {
    is_enabled: boolean
    days_before: number
    days_after: number
    percent: number
    services: string[]
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

export interface IBranch {
    _id: string
    title: string
    type: string
    description: string
    address: string
    phone: number
    company_id: string
    appointment_settings: IAppointmentSettings
    discount_priority: DiscountPriority
    discount_settings: IDiscountSettings
    birthday_discount_settings: IBirthdayDiscountSettings
    form_settings: IFormSettings
}