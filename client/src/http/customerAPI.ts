import Request, { Data } from "."


const customerRoute = 'customer'

export const getAuthCode = async (phone: number | string) =>
    await Request.get(`${customerRoute}/auth/code/${phone}`)

export const sendAuthCode = async (phone: number | string, code: Data, branchId: string) =>
    await Request.post(`${customerRoute}/auth/code/${phone}`, code, branchId)

export const loginWithPassword = async (data: Data, branchId: string) =>
    await Request.post(`${customerRoute}/auth/password`, data, branchId)

export const getCustomerData = async (token: string, branchId: string) =>
    await Request.get(`${customerRoute}/${token}`, branchId)

export const getCustomerRecords = async (id: string) =>
    await Request.get(`${customerRoute}/${id}/records`)

export const editCustomerData = async (data: Data, id: string) =>
    await Request.post(`${customerRoute}/${id}`, data)