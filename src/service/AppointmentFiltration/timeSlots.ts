import { getFormattedTime } from "../../utils/date.js"
import { IRecordTimeLimits } from "./branch.js"
import { IMasterServiceDuration, IMasterRecords, IStartEnd } from "./masters.js"


const calculateUnavailableTimeForRecording = (
    mastersRecordings: IMasterRecords[],
    serviceDurationFromMasters: IMasterServiceDuration[]
): IMasterRecords[] => {
    return mastersRecordings.map(master => {
        const msd = serviceDurationFromMasters.find(sd => sd.masterId === master.masterId)
        return {
            masterId: master.masterId,
            records: master.records.map(({ start, end }) => {
                return {
                    start: start - (msd ? msd.serviceDuration : 0),
                    end
                }
            })
        }
    })
}

const mergeRecords = (
    calculatedRecords: IMasterRecords[]
): IStartEnd[] => {
    const mergedRecords: IStartEnd[] = []
    calculatedRecords[0].records.forEach(record => {
        let unTimes = [record]
        for (let i = 1; i < calculatedRecords.length; i++) {
            const temp: IStartEnd[] = []
            for (const unavailableTime of unTimes) {
                const matchingRecords = calculatedRecords[i].records.filter(otherRecord =>
                    otherRecord.start <= unavailableTime.end
                    && otherRecord.end >= unavailableTime.start
                )
                if (matchingRecords.length) {
                    const a = matchingRecords.map(matchingRecord => {
                        return {
                            start: unavailableTime.start >= matchingRecord.start
                                ? unavailableTime.start
                                : matchingRecord.start,
                            end: unavailableTime.end >= matchingRecord.end
                                ? matchingRecord.end
                                : unavailableTime.end
                        }
                    })
                    a.forEach(el => temp.push(el))
                }
            }
            unTimes = temp
        }
        if (unTimes.length) {
            unTimes.forEach(unTime => mergedRecords.push(unTime))
        }
    })

    return mergedRecords
}

export const generateTimeSlots = (
    masterRecordings: IMasterRecords[],
    serviceDurationFromMasters: IMasterServiceDuration[],
    recordTimeLimits: IRecordTimeLimits,
    day: Date
) => {
    const calculatedRecords = calculateUnavailableTimeForRecording(masterRecordings, serviceDurationFromMasters)
    const unavailableTimes = mergeRecords(calculatedRecords)

    const { interval, start, end } = recordTimeLimits
    const serviceDurations = serviceDurationFromMasters.map(sd => sd.serviceDuration)
    serviceDurations.sort((a, b) => a - b)
    const startDay = day.setHours(start.hours, start.minutes, 0, 0)
    const endDay = day.setHours(end.hours, end.minutes, 0, 0) - serviceDurations[0]

    const timeArr = []
    for (let i = startDay; i < endDay; i += interval) {
        if (i < Date.parse(new Date().toString())) {
            continue;
        }
        const isUnavailableTime = unavailableTimes.some(({ start, end }) =>
            start <= i && i <= end
        )
        if (isUnavailableTime) {
            continue
        }
        timeArr.push(getFormattedTime(i))
    }
    return timeArr
}