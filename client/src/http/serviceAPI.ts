import Request from "."
import { Data } from "."


const serviceRoute = 'service'

export const getServices = async (masterId: string, date: number, branchId: string, customerToken?: string) =>
    await Request.get(`${serviceRoute}/?master_id=${masterId}&date=${date}&customer_token=${customerToken}`, branchId)

export const createService = async (data: Data, branchId: string) =>
    await Request.post(`${serviceRoute}`, data, branchId)

export const editService = async (data: Data, masterId: string, branchId: string) =>
    await Request.put(`${serviceRoute}/${masterId}`, data, branchId)

export const deleteService = async (masterId: string, branchId: string) =>
    await Request.delete(`${serviceRoute}/${masterId}`, branchId)