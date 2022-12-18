import { CustomerAction } from "../types"

const initialState = {
    _id: '',
    name: [],
    phone: 0,
    email: [''],
    birthdate: new Date()
}

export default function customerReducer(state = initialState, action: CustomerAction) {
    switch (action.type) {
        case 'updateCustomerData':
            return { ...state, ...action.payload }
        case 'deleteAllCustomerData':
            return initialState
        default:
            return state
    }
}