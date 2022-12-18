import { getDays } from '../../utils/date.js'
import { getMastersByService, getServiceDurationFromMasters, getMastersRecordings, getMasterIds } from './masters.js'
import { getServicesByMaster, getMasterIdsFromServices } from './services.js'
import { getRecordTimeLimits } from './branch.js'
import { generateTimeSlots } from './timeSlots.js'
import { checkAvailableTimeSpanForService } from './records.js'


class AppointmentFiltration {

    async getMasters(branchId: string, serviceId: string, date: Date | null) {

        const hasDate = !!date && date.toString() !== 'Invalid Date'

        const mastersByService = await getMastersByService(serviceId, branchId)
        if (!mastersByService.length) {
            return mastersByService
        }
        const masterIds = mastersByService.map(master => master._id.toString())

        const recordTimeLimits = await getRecordTimeLimits(branchId)

        const serviceDurationFromMasters = await getServiceDurationFromMasters(masterIds, serviceId)

        const startDate = hasDate ? date : new Date()
        const endDate = hasDate ? date : recordTimeLimits.maxDate
        const mastersRecordings = await getMastersRecordings(masterIds, startDate, endDate)

        const availableMasters: string[] = []
        for (const masterRecords of mastersRecordings) {

            const msd = serviceDurationFromMasters.find(sd => sd.masterId === masterRecords.masterId)

            if (date) {
                const serviceEnd = Date.parse(date.toString()) + (msd ? msd.serviceDuration : 0)

                const endDay = date.setHours(recordTimeLimits.end.hours, recordTimeLimits.end.minutes, 0, 0)
                if (serviceEnd >= endDay) {
                    continue;
                }

                const isUnavailable = masterRecords.records.some(record => record.start <= serviceEnd && serviceEnd <= record.end)
                if (!isUnavailable) {
                    availableMasters.push(masterRecords.masterId)
                }
            } else {
                const days = getDays(new Date(), recordTimeLimits.maxDate)
                daysLoop: for (const day of days) {
                    const hasAvailableTimeSpan = checkAvailableTimeSpanForService(masterRecords.records, msd ? msd.serviceDuration : 0, day)
                    if (hasAvailableTimeSpan) {
                        availableMasters.push(masterRecords.masterId)
                        break daysLoop;
                    }
                }
            }
        }

        return mastersByService.filter(master => availableMasters.includes(master._id.toString()))
    }

    async getServices(branchId: string, masterId: string, date: Date | null) {

        const hasDate = !!date && date.toString() !== 'Invalid Date'

        const servicesByMaster = await getServicesByMaster(masterId, branchId)
        if (!servicesByMaster.length) {
            return servicesByMaster
        }

        const recordTimeLimits = await getRecordTimeLimits(branchId)

        const masterIds = getMasterIdsFromServices(servicesByMaster, masterId)
        const startDate = hasDate ? date : new Date()
        const endDate = hasDate ? date : recordTimeLimits.maxDate
        const mastersRecordings = await getMastersRecordings(masterIds, startDate, endDate)

        const availableServices: string[] = []
        serviceLoop: for (const service of servicesByMaster) {
            if (date) {
                const serviceEnd = Date.parse(date.toString()) + service.duration
                const endDay = date.setHours(recordTimeLimits.end.hours, recordTimeLimits.end.minutes, 0, 0)
                if (serviceEnd >= endDay) {
                    continue;
                }

                for (const masterRecords of mastersRecordings) {
                    const isUnavailable = masterRecords.records.some(record => record.start <= serviceEnd && serviceEnd <= record.end)
                    if (!isUnavailable) {
                        availableServices.push(service._id.toString())
                        continue serviceLoop;
                    }
                }
            } else {
                const days = getDays(new Date(), recordTimeLimits.maxDate)
                daysLoop: for (const day of days) {
                    for (const masterRecords of mastersRecordings) {
                        const hasAvailableTimeSpan = checkAvailableTimeSpanForService(masterRecords.records, service.duration, day)
                        if (hasAvailableTimeSpan) {
                            availableServices.push(service._id.toString())
                            break daysLoop;
                        }
                    }
                }
            }
        }

        return servicesByMaster.filter(service => availableServices.includes(service._id.toString()))
    }

    async getUnavailableDates(branchId: string, masterId: string, serviceId: string) {

        const recordTimeLimits = await getRecordTimeLimits(branchId)

        const masterIds = await getMasterIds(masterId, serviceId, branchId)

        const mastersRecordings = await getMastersRecordings(masterIds, new Date(), recordTimeLimits.maxDate)

        const serviceDurationFromMasters = await getServiceDurationFromMasters(masterIds, serviceId)

        const days = getDays(new Date(), recordTimeLimits.maxDate)

        const unavailableDates: Date[] = []
        for (const day of days) {
            const unavailableMasters = []
            masterLoop: for (const masterRecords of mastersRecordings) {
                const msd = serviceDurationFromMasters.find(master => master.masterId === masterRecords.masterId)
                const hasAvailableTimeSpan = checkAvailableTimeSpanForService(masterRecords.records, msd ? msd.serviceDuration : 0, day)
                if (hasAvailableTimeSpan) {
                    continue masterLoop;
                }
                unavailableMasters.push(masterRecords.masterId)
            }

            if (unavailableMasters.length === mastersRecordings.length) {
                unavailableDates.push(day)
            }
        }

        return {
            unavailableDates,
            maxDate: recordTimeLimits.maxDate
        }
    }

    async getTimeSlots(branchId: string, masterId: string, serviceId: string, day: Date) {

        const recordTimeLimits = await getRecordTimeLimits(branchId)

        const masterIds = await getMasterIds(masterId, serviceId, branchId)

        const mastersRecordings = await getMastersRecordings(masterIds, day)

        const serviceDurationFromMasters = await getServiceDurationFromMasters(masterIds, serviceId)

        return generateTimeSlots(
            mastersRecordings,
            serviceDurationFromMasters,
            recordTimeLimits,
            day
        )
    }
}

export default new AppointmentFiltration()