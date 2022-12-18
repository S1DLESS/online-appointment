import Request from "."
import { Data } from "."


const branchRoute = 'branch'

export const getBranches = async () =>
    await Request.get(`${branchRoute}`)

export const getBranch = async (branchId: string) =>
    await Request.get(`${branchRoute}/${branchId}`)

export const createBranch = async (data: Data) =>
    await Request.post(`${branchRoute}`, data)

export const editBranch = async (data: Data, branchId: string) =>
    await Request.put(`${branchRoute}/${branchId}`, data)

export const editDiscountBranch = async (data: Data, branchId: string) =>
    await Request.put(`${branchRoute}/${branchId}?discount=true`, data)

export const editFormBranch = async (data: Data, branchId: string) =>
    await Request.put(`${branchRoute}/${branchId}/form`, data)

export const editAppointmentBranch = async (data: Data, branchId: string) =>
    await Request.put(`${branchRoute}/${branchId}/appointment`, data)

export const deleteBranch = async (branchId: string) =>
    await Request.delete(`${branchRoute}/${branchId}`)