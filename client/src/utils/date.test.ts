import { getFormattedDate, getFormattedTime, getMonthName, getWeekDay, setTimeToDate } from "./date"


describe('getMonthName', () => {
    test("Пограничное значение снизу без nominativeCase", () => {
        expect(getMonthName(0)).toBe('января')
    })
    test("Корректное значение без nominativeCase", () => {
        expect(getMonthName(6)).toBe('июля')
    })
    test("Пограничное значение сверху без nominativeCase", () => {
        expect(getMonthName(11)).toBe('декабря')
    })
    test("Значение меньше корректного без nominativeCase", () => {
        expect(getMonthName(-1)).toBe('')
    })
    test("Значение больше корректного без nominativeCase", () => {
        expect(getMonthName(12)).toBe('')
    })
    test("Значение NaN без nominativeCase", () => {
        expect(getMonthName(NaN)).toBe('')
    })

    test("Пограничное значение снизу с nominativeCase", () => {
        expect(getMonthName(0, true)).toBe('Январь')
    })
    test("Корректное значение с nominativeCase", () => {
        expect(getMonthName(6, true)).toBe('Июль')
    })
    test("Пограничное значение сверху с nominativeCase", () => {
        expect(getMonthName(11, true)).toBe('Декабрь')
    })
    test("Значение меньше корректного с nominativeCase", () => {
        expect(getMonthName(-1, true)).toBe('')
    })
    test("Значение больше корректного с nominativeCase", () => {
        expect(getMonthName(12, true)).toBe('')
    })
    test("Значение NaN с nominativeCase", () => {
        expect(getMonthName(NaN, true)).toBe('')
    })
})

describe('getWeekDay', () => {
    test("Пограничное значение снизу без abbr", () => {
        expect(getWeekDay(1)).toBe('Понедельник')
    })
    test("Корректное значение без abbr", () => {
        expect(getWeekDay(4)).toBe('Четверг')
    })
    test("Пограничное значение сверху без abbr", () => {
        expect(getWeekDay(0)).toBe('Воскресенье')
    })
    test("Значение меньше корректного без abbr", () => {
        expect(getWeekDay(-1)).toBe('')
    })
    test("Значение больше корректного без abbr", () => {
        expect(getWeekDay(7)).toBe('')
    })
    test("Значение NaN без abbr", () => {
        expect(getWeekDay(NaN)).toBe('')
    })

    test("Пограничное значение снизу с abbr", () => {
        expect(getWeekDay(1, true)).toBe('ПН')
    })
    test("Корректное значение с abbr", () => {
        expect(getWeekDay(4, true)).toBe('ЧТ')
    })
    test("Пограничное значение сверху с abbr", () => {
        expect(getWeekDay(0, true)).toBe('ВС')
    })
    test("Значение меньше корректного с abbr", () => {
        expect(getWeekDay(-1, true)).toBe('')
    })
    test("Значение больше корректного с abbr", () => {
        expect(getWeekDay(7, true)).toBe('')
    })
    test("Значение NaN с abbr", () => {
        expect(getWeekDay(NaN, true)).toBe('')
    })
})

describe("getFormattedTime", () => {
    test("Валидная дата со временем 9:00", () => {
        const date = new Date(new Date().setHours(9, 0, 0, 0))
        expect(getFormattedTime(date)).toBe("9:00")
    })
    test("Валидная дата со временем 12:00", () => {
        const date = new Date(new Date().setHours(12, 0, 0, 0))
        expect(getFormattedTime(date)).toBe("12:00")
    })
    test("Валидная дата со временем 9:30", () => {
        const date = new Date(new Date().setHours(9, 30, 0, 0))
        expect(getFormattedTime(date)).toBe("9:30")
    })
    test("Валидная дата со временем 12:30", () => {
        const date = new Date(new Date().setHours(12, 30, 0, 0))
        expect(getFormattedTime(date)).toBe("12:30")
    })
    test("Невалидная дата", () => {
        const date = new Date('')
        expect(getFormattedTime(date)).toBe("")
    })
})

describe("getFormattedDate", () => {
    test("Валидная дата 01.01.2022 - type: year-month-day", () => {
        const a = new Date().setFullYear(2022)
        const b = new Date(a).setMonth(0)
        const c = new Date(b).setDate(1)
        const date = new Date(c)
        expect(getFormattedDate(date, 'year-month-day')).toBe("2022-01-01")
    })
    test("Валидная дата 30.01.2022 - type: year-month-day", () => {
        const a = new Date().setFullYear(2022)
        const b = new Date(a).setMonth(0)
        const c = new Date(b).setDate(30)
        const date = new Date(c)
        expect(getFormattedDate(date, 'year-month-day')).toBe("2022-01-30")
    })
    test("Валидная дата 01.12.2022 - type: year-month-day", () => {
        const a = new Date().setFullYear(2022)
        const b = new Date(a).setMonth(11)
        const c = new Date(b).setDate(1)
        const date = new Date(c)
        expect(getFormattedDate(date, 'year-month-day')).toBe("2022-12-01")
    })
    test("Валидная дата 30.12.2022 - type: year-month-day", () => {
        const a = new Date().setFullYear(2022)
        const b = new Date(a).setMonth(11)
        const c = new Date(b).setDate(30)
        const date = new Date(c)
        expect(getFormattedDate(date, 'year-month-day')).toBe("2022-12-30")
    })

    test("Валидная дата 01.01.2022 - type: weekDay, day month", () => {
        const a = new Date().setFullYear(2022)
        const b = new Date(a).setMonth(0)
        const c = new Date(b).setDate(1)
        const date = new Date(c)
        expect(getFormattedDate(date, 'weekDay, day month')).toBe("Суббота, 1 января")
    })
    test("Валидная дата 30.01.2022 - type: weekDay, day month", () => {
        const a = new Date().setFullYear(2022)
        const b = new Date(a).setMonth(0)
        const c = new Date(b).setDate(30)
        const date = new Date(c)
        expect(getFormattedDate(date, 'weekDay, day month')).toBe("Воскресенье, 30 января")
    })
    test("Валидная дата 01.12.2022 - type: weekDay, day month", () => {
        const a = new Date().setFullYear(2022)
        const b = new Date(a).setMonth(11)
        const c = new Date(b).setDate(1)
        const date = new Date(c)
        expect(getFormattedDate(date, 'weekDay, day month')).toBe("Четверг, 1 декабря")
    })
    test("Валидная дата 30.12.2022 - type: weekDay, day month", () => {
        const a = new Date().setFullYear(2022)
        const b = new Date(a).setMonth(11)
        const c = new Date(b).setDate(30)
        const date = new Date(c)
        expect(getFormattedDate(date, 'weekDay, day month')).toBe("Пятница, 30 декабря")
    })

    test("Невалидная дата - type: year-month-day", () => {
        const date = new Date('')
        expect(getFormattedDate(date, 'year-month-day')).toBe("")
    })
    test("Невалидная дата - type: weekDay, day month", () => {
        const date = new Date('')
        expect(getFormattedDate(date, 'weekDay, day month')).toBe("")
    })
})

describe("setTimeToDate", () => {
    test("Валидная дата - Валидная строка времени", () => {
        const a = new Date().setFullYear(2022)
        const b = new Date(a).setMonth(0)
        const c = new Date(b).setDate(1)
        const date = new Date(c)
        expect(setTimeToDate(date, '12:00')).toBe(1641027600000)
    })
    test("Валидная дата - Невалидная строка времени", () => {
        expect(setTimeToDate(new Date(), 'asd')).toBe(NaN)
    })

    test("Невалидная дата - Валидная строка времени", () => {
        expect(setTimeToDate(new Date(''), '12:00')).toBe(NaN)
    })
    test("Невалидная дата - Невалидная строка времени", () => {
        expect(setTimeToDate(new Date(''), '')).toBe(NaN)
    })
})