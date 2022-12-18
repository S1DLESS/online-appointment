import { IService } from "../models/IService"


export const getServicePrice = (service: IService) => {
    if (service.has_discount) {
        return `${service.discount_price} руб. (${service.discount_type}) - ${getTimeFromMins(service.duration)}`
    } else {
        return `${service.price} руб. - ${getTimeFromMins(service.duration)}`
    }
}

const getTimeFromMins = (time: number) => {
    const minutes = (time + 1) / 60 / 1000
    if (minutes >= 60) {
        const hours = Math.trunc(minutes / 60)
        const minutesInHour = minutes % 60
        return `${hours} ч.${minutesInHour ? ` ${minutesInHour} мин.` : ''}`
    } else {
        return `${minutes} мин.`
    }
}