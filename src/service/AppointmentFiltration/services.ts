import { Document, Types } from 'mongoose';
import ServiceModel, { IService } from '../../models/ServiceModel.js'


export const getServicesByMaster = async (masterId: string, branchId: string) => {
    return await ServiceModel.find(masterId
        ? {master_ids: masterId, is_deleted: false}
        : {branch_id: branchId, master_ids: {$exists: true, $ne: []}, is_deleted: false})
}

export const getMasterIdsFromServices = (
    services: (Document<unknown, unknown, IService> & IService & {
        _id: Types.ObjectId;
    })[],
    masterId: string
) => {
    if (masterId) {
        return [masterId]
    } else {
        const masterIds: string[] = []
        const arraysOfMasterIds = services.map(service => service.master_ids.map(id => id.toString()))
        arraysOfMasterIds.forEach(ids => ids.forEach(id => masterIds.push(id)))
        return [...new Set(masterIds)]
    }
}