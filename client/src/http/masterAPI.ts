import Request from "."
import { Data } from "."


const masterRoute = 'master'

export const getMasters = async (serviceId: string, date: number, branchId: string) =>
    await Request.get(`${masterRoute}/?service_id=${serviceId}&date=${date}`, branchId)

export const createMaster = async (data: Data, branchId: string) =>
    await Request.post(`${masterRoute}`, data, branchId)

export const editMaster = async (data: Data, masterId: string, branchId: string) =>
    await Request.put(`${masterRoute}/${masterId}`, data, branchId)

export const deleteMaster = async (masterId: string, branchId: string) =>
    await Request.delete(`${masterRoute}/${masterId}`, branchId)