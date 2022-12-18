import Request from "."


const clientRoute = 'client'

export const getTime = async (date: number, branchId: string, masterId: string = '', serviceId: string = '') => {
    return await Request.get(`${clientRoute}/time?date=${date}&master_id=${masterId}&service_id=${serviceId}`, branchId)
}

export const getUnavailableDates = async (branchId: string, masterId: string = '', serviceId: string = '') => {
    return await Request.get(`${clientRoute}/date?master_id=${masterId}&service_id=${serviceId}`, branchId)
}