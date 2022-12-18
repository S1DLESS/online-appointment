import MasterModel from '../../models/MasterModel.js'
import ServiceModel, { IService } from '../../models/ServiceModel.js'
import RecordModel from '../../models/RecordModel.js'
import { Document, Types } from 'mongoose'


export interface IStartEnd {
    start: number
    end: number
}

export interface IMasterRecords {
    masterId: string
    records: IStartEnd[]
}

export interface IMasterServiceDuration {
    masterId: string
    serviceDuration: number
}

export const getMastersByService = async (serviceId: string, branchId: string) => {
    return await MasterModel.find(serviceId
        ? { service_ids: serviceId, is_deleted: false }
        : { branch_id: branchId, service_ids: { $exists: true, $ne: [] }, is_deleted: false })
}

export const getMasterIds = async (masterId: string, serviceId: string, branchId: string) => {
    if (masterId) {
        return [masterId]
    } else {
        const masters = await getMastersByService(serviceId, branchId)
        return masters.map(master => master._id.toString())
    }
}

export const getServiceDurationFromMasters = async (
    masterIds: string[],
    serviceId: string
): Promise<IMasterServiceDuration[] | []> => {
    if (serviceId) {
        const service = await ServiceModel.findById(serviceId)
        if (service) {
            return masterIds.map(masterId => {
                return {
                    masterId,
                    serviceDuration: service.duration
                }
            })
        } else {
            return []
        }
    } else {
        const services = await ServiceModel.find({
            $or: masterIds.map(masterId => {
                return { master_ids: masterId }
            }),
            is_deleted: false
        })

        const getMinDurationOfMasterService = (
            services: (Document<unknown, unknown, IService> & IService & {
                _id: Types.ObjectId;
            })[],
            masterId: string
        ) => {
            const s = services.map(service => {
                return { ...service.toJSON(), master_ids: service.master_ids.map(ids => ids.toString()) }
            })
            const ss = s.filter(service => service.master_ids.includes(masterId)).sort((a, b) => a.duration - b.duration)
            return ss[0].duration
        }

        if (services.length) {
            return masterIds.map(masterId => {
                return {
                    masterId,
                    serviceDuration: getMinDurationOfMasterService(services, masterId)
                }
            })
        } else {
            return []
        }
    }
}

export const getMastersRecordings = async (
    masterIds: string[],
    startDate: Date,
    endDate: Date = startDate
): Promise<IMasterRecords[] | []> => {
    if (!masterIds.length) {
        return []
    }
    const records = await RecordModel.find({
        master_id: masterIds,
        date: {
            $gte: new Date(startDate.setHours(0, 0, 0, 0)),
            $lte: new Date(endDate.setHours(23, 59, 59, 999))
        }
    })
    // ! Уже обращались к модели Услуги 
    const services = await ServiceModel.find({ _id: records.map(record => record.service_id) })

    return masterIds.map(masterId => {
        const masterRecords = records.filter(record => record.master_id.toString() === masterId)
        return {
            masterId,
            records: masterRecords.map(record => {
                const service = services.find(service => service._id.toString() === record.service_id.toString())
                return {
                    start: Date.parse(record.date.toString()),
                    end: Date.parse(record.date.toString()) + (service ? service.duration : 0)
                }
            })
        }
    })
}