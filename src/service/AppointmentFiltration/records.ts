import { IStartEnd } from "./masters.js"


export const checkAvailableTimeSpanForService = (records: IStartEnd[], serviceDuration: number, day: Date) => {
    const startDay = day.setHours(0, 0, 0, 0)
    const endDay = day.setHours(23, 59, 59, 999)
    const recordsOfDay = records.filter(record =>
        startDay <= record.start && record.end <= endDay
    )
    if (recordsOfDay.length) {
        recordsOfDay.sort((a, b) => a.start - b.start)
        for (let i = 0; i < recordsOfDay.length; i++) {
            let timeIntervalBefore = 0
            let timeIntervalAfter = 0
            if (i = 0) {
                timeIntervalBefore = recordsOfDay[i].start - startDay
                timeIntervalAfter = i === recordsOfDay.length - 1
                    ? endDay - recordsOfDay[i].end
                    : recordsOfDay[i + 1].start - recordsOfDay[i].end
            }
            if (i === recordsOfDay.length - 1) {
                timeIntervalBefore = i === 0
                    ? recordsOfDay[i].start - startDay
                    : recordsOfDay[i].start - recordsOfDay[i - 1].end
                timeIntervalAfter = endDay - recordsOfDay[i].end
            }
            if (serviceDuration + 1 < timeIntervalBefore || serviceDuration + 1 < timeIntervalAfter) {
                return true
            }
        }
    } else {
        if (serviceDuration <= endDay - startDay) {
            return true
        }
    }
    return false
}