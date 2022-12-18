import Request from "."
import { Data } from "."


const recordRoute = 'record'

export const createRecord = async (data: Data, branchId: string, sendConfirmation: string = '') =>
    await Request.post(`${recordRoute}?send_confirmation=${sendConfirmation}`, data, branchId)

export const editRecord = async (data: Data, recordId: string, branchId: string) =>
    await Request.put(`${recordRoute}/${recordId}`, data, branchId)

export const deleteRecord = async (recordId: string, branchId: string) =>
    await Request.delete(`${recordRoute}/${recordId}`, branchId)