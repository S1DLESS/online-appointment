import Request from "."
import { Data } from "."


const userRoute = 'user'

export const checkToken = async () =>
    await Request.get(`${userRoute}/auth`)

export const getBranchData = async (id: string) =>
    await Request.get(`${userRoute}/branchdata/${id}`)

export const registration = async (data: Data) =>
    await Request.post(`${userRoute}/registration`, data)

export const login = async (data: Data) =>
    await Request.post(`${userRoute}/login`, data)

export const reset = async (data: Data) =>
    await Request.post(`${userRoute}/reset`, data)

export const resetPassword = async (data: Data, token: string) =>
    await Request.post(`${userRoute}/reset-password/${token}`, data)

export const editUser = async (data: Data, id: string) =>
    await Request.put(`${userRoute}/edituser/${id}`, data)

export const editCompany = async (data: Data, id: string) =>
    await Request.put(`${userRoute}/editcompany/${id}`, data)

export const deleteAccount = async (data: Data, id: string) =>
    await Request.post(`${userRoute}/deleteaccount/${id}`, data)