import BranchModel from '../../models/BranchModel.js'


export interface IRecordTimeLimits {
    start: {
        hours: number
        minutes: number
    }
    end: {
        hours: number
        minutes: number
    }
    maxDate: Date
    interval: number
}

export const getRecordTimeLimits = async (
    branchId: string
): Promise<IRecordTimeLimits> => {
    const branch = await BranchModel.findById(branchId)
    if (branch) {
        return {
            start: {
                hours: branch.appointment_settings.start_time.hours,
                minutes: branch.appointment_settings.start_time.minutes
            },
            end: {
                hours: branch.appointment_settings.end_time.hours,
                minutes: branch.appointment_settings.end_time.minutes
            },
            maxDate: new Date(new Date().setDate(new Date().getDate() + branch.appointment_settings.available_days)),
            interval: branch.appointment_settings.interval
        }
    } else {
        throw new Error('Филиал не найден!')
    }
}