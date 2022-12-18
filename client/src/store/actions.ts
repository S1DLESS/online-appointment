import { AdminActionEnum, ClientActionEnum, CustomerActionEnum, DeleteAdminAction, DeleteClientAction, DeleteCustomerAction, UpdateAdminAction, UpdateClientAction, UpdateCustomerAction } from "./types"


export const updateCustomerData = (payload: Object): UpdateCustomerAction => {
    return {
        type: CustomerActionEnum.UPDATE,
        payload
    }
}

export const updateClientData = (payload: Object): UpdateClientAction => {
    return {
        type: ClientActionEnum.UPDATE,
        payload
    }
}

export const updateAdminData = (payload: Object): UpdateAdminAction => {
    return {
        type: AdminActionEnum.UPDATE,
        payload
    }
}

export const deleteAllClientData = (): DeleteClientAction => {
    return {
        type: ClientActionEnum.DELETE
    }
}

export const deleteAllAdminData = (): DeleteAdminAction => {
    return {
        type: AdminActionEnum.DELETE
    }
}

export const deleteAllCustomerData = (): DeleteCustomerAction => {
    return {
        type: CustomerActionEnum.DELETE
    }
}