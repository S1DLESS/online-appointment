export const getMonthName = (month: number, nominativeCase: boolean = false) => {
    const months = nominativeCase
        ? ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
        : ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    return (month >= 0 && month <= 11 && !isNaN(month)) ? months[month] : ''
}

export const getWeekDay = (weekDay: number, abbr: boolean = false) => {
    const days = abbr
        ? ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']
        : ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    return (weekDay >= 0 && weekDay <= 6 && !isNaN(weekDay)) ? days[weekDay] : ''
}

export const getFormattedTime = (date: Date) => {
    if (date.toString() !== "Invalid Date") {
        const hours = date.getHours()
        const minutes = date.getMinutes()
        return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`
    } else {
        return ''
    }
}

type FormattedDateType = 'year-month-day' | 'weekDay, day month'

export const getFormattedDate = (date: Date, type: FormattedDateType) => {
    if (date.toString() !== "Invalid Date") {
        if (type === 'year-month-day') {
            const year = date.getFullYear()
            const month = `${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}`
            const day = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}`
            return `${year}-${month}-${day}`
        } else {
            const weekDay = getWeekDay(date.getDay())
            const day = date.getDate()
            const month = getMonthName(date.getMonth())
            return `${weekDay}, ${day} ${month}`
        }
    } else {
        return ''
    }
}

export const setTimeToDate = (date: Date, time: string) => {
    const matchHoursArr = time.match(/[0-9]*/)
    const matchMinutesArr = time.match(/[0-9]*$/)
    const matchHoursString = matchHoursArr ? matchHoursArr[0] : ''
    const matchMinutesString = matchMinutesArr ? matchMinutesArr[0] : ''
    const hours = matchHoursString ? +matchHoursString : NaN
    const minutes = matchMinutesString ? +matchMinutesString : NaN
    return date.setHours(hours, minutes, 0, 0)
}