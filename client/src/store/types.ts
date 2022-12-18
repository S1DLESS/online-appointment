export enum CustomerActionEnum {
    UPDATE = 'updateCustomerData',
    DELETE = 'deleteAllCustomerData'
}

export enum ClientActionEnum {
    UPDATE = 'updateClientData',
    DELETE = 'deleteAllClientData'
}

export enum AdminActionEnum {
    UPDATE = 'updateAdminData',
    DELETE = 'deleteAllAdminData'
}

export interface UpdateCustomerAction {
    type: CustomerActionEnum.UPDATE
    payload?: Object
}

export interface DeleteCustomerAction {
    type: CustomerActionEnum.DELETE
    payload?: Object
}

export interface UpdateClientAction {
    type: ClientActionEnum.UPDATE
    payload?: Object
}

export interface DeleteClientAction {
    type: ClientActionEnum.DELETE
    payload?: Object
}

export interface UpdateAdminAction {
    type: AdminActionEnum.UPDATE
    payload?: Object
}

export interface DeleteAdminAction {
    type: AdminActionEnum.DELETE
    payload?: Object
}

export type AdminAction = UpdateAdminAction | DeleteAdminAction
export type ClientAction = UpdateClientAction | DeleteClientAction
export type CustomerAction = UpdateCustomerAction | DeleteCustomerAction