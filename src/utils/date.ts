export const getFormattedTime = (date: number) => {
    const hours = new Date(date).getHours()
    const minutes = new Date(date).getMinutes()
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`
}

export const getFormattedDate = (date: number) => {
    const day = new Date(date).getDate()
    const month = new Date(date).getMonth() + 1
    const year = new Date(date).getFullYear()
    return `${day}.${month}.${year}`
}

export const getDays = (startDate: Date, endDate: Date) => {
    const arr = []

    const startTimestamp = startDate.setHours(0,0,0,0)
    const endTimestamp = endDate.setHours(0,0,0,0)

    for (let i = startTimestamp; i <= endTimestamp; i += 24 * 60 * 60 * 1000) {
        arr.push(new Date(i))
    }

    return arr
}