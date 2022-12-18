import { IBranch } from "../../models/IBranch"
import { IMaster } from "../../models/IMaster"
import { IService } from "../../models/IService"
import { ClientAction } from "../types"

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

const selectedService: IService = {
    _id: '',
    title: '',
    duration: 0,
    price: 0,
    description: '',
    avatar_url: '',
    branch_id: '',
    master_ids: [],
    is_deleted: false,
    has_discount: false,
    discount_type: '',
    discount_price: 0
}

const selectedMaster: IMaster = {
    _id: '',
    name: '',
    position: '',
    description: '',
    avatar_url: '',
    branch_id: '',
    service_ids: [],
    is_deleted: false
}

const initialState = {
    branch,
    selectedMaster,
    selectedService,
    selectedDate: new Date(0),
    name: '',
    phone: '',
    email: '',
    comment: ''
}

export default function clientReducer(state = initialState, action: ClientAction) {
    switch (action.type) {
        case 'updateClientData':
            return { ...state, ...action.payload }
        case 'deleteAllClientData':
            return initialState
        default:
            return state
    }
}