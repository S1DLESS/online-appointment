import { AdminAction } from "../types"
import { IRecord } from "../../models/IRecord"
import { IMaster } from "../../models/IMaster"
import { IService } from "../../models/IService"
import { IBranch } from "../../models/IBranch"
import { IUser } from "../../models/IUser"
import { ICompany } from "../../models/ICompany"


const branch: IBranch = {
    _id: '',
    title: '',
    type: '',
    description: '',
    address: '',
    phone: 0,
    company_id: '',
    appointment_settings: {
        available_days: 0,
        timezone: '',
        start_time: {
            hours: 0,
            minutes: 0
        },
        end_time: {
            hours: 0,
            minutes: 0
        },
        interval: 0
    },
    discount_priority: 'birthday',
    discount_settings: {
        is_enabled: false,
        visits: 0,
        time_in_days: 0,
        percent: 0,
        services: []
    },
    birthday_discount_settings: {
        is_enabled: false,
        days_before: 0,
        days_after: 0,
        percent: 0,
        services: []
    },
    form_settings: {
        background: {
            type: '',
            src: ''
        },
        main_color: ''
    }
}

const master: IMaster = {
    _id: '',
    name: '',
    position: '',
    description: '',
    avatar_url: '',
    branch_id: '',
    service_ids: [''],
    is_deleted: false
}

const service: IService = {
    _id: '',
    title: '',
    duration: 0,
    price: 0,
    description: '',
    avatar_url: '',
    branch_id: '',
    master_ids: [''],
    is_deleted: false,
    has_discount: false,
    discount_type: '',
    discount_price: 0
}

const record: IRecord = {
    _id: '',

    name: '',
    phone: '',
    email: '',

    customer_id: '',
    comment: '',
    date: new Date(0),
    branch_id: '',
    master_id: '',
    service_id: '',
    is_service_discounted: false,
    discount_percent: 0,
    discount_type: ''
}

const customer = {
    _id: '',
    name: ''
}

const user: IUser = {
    _id: '',
    name: '',
    email: '',
    password: '',
    is_activated: false,
    activation_link: '',
    company_id: ''
}

const company: ICompany = {
    _id: '',
    title: '',
    description: ''
}

const initialState = {
    user,
    company,
    branches: [branch],
    masters: [master],
    services: [service],
    records: [record],
    customers: [customer]
}

export default function adminReducer(state = initialState, action: AdminAction) {
    switch (action.type) {
        case 'updateAdminData':
            return { ...state, ...action.payload }
        case 'deleteAllAdminData':
            return initialState
        default:
            return state
    }
}