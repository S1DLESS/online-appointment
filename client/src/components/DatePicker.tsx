import { TextField, ToggleButton } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { getUnavailableDates } from '../http/clientAPI';
import Loader from './UI/Loader'
import { getFormattedDate } from '../utils/date';
import DayButtons from './DayButtons';


interface CalendarPickerProps {
    isopen: boolean
}

const DateButtons = styled.div`
    display: flex;
`

const CalendarOpenButton = styled(ToggleButton)`
    align-self: center;
    border-radius: 8px;
`

const CalendarPicker = styled(StaticDatePicker) <CalendarPickerProps>`
    height: ${props => props.isopen ? '300px' : '0'};
    transition: height .25s;
`

interface Props {
    date: string
    onChange: (a: string) => void
    masterId: string
    serviceId: string
    branchId: string
}

export default function DatePicker({ date, onChange, masterId, serviceId, branchId }: Props) {

    const [loading, setLoading] = useState(true)
    const [isOpenCalendar, setIsOpenCalendar] = useState(false)

    const [unavailableDates, setUnavailableDates] = useState<Date[]>([])
    const [maxDate, setMaxDate] = useState<Date>(new Date())

    useEffect(() => {
        getUnavailableDates(
            branchId,
            masterId,
            serviceId
        ).then(res => {
            if (res.unavailableDates) {
                setUnavailableDates(res.unavailableDates)
                setMaxDate(new Date(res.maxDate))
                for (let i = 0; i < 30; i++) {
                    const initDate = date ? new Date(date) : new Date()
                    const spd = initDate.setHours(0, 0, 0, 0) + (24 * 60 * 60 * 1000) * i
                    const spdIsUnavailable = unavailableDates.some(date => spd === new Date(date).setHours(0, 0, 0, 0))
                    if (!spdIsUnavailable) {
                        onChange(getFormattedDate(new Date(spd), 'year-month-day'))
                        break;
                    }
                }
            }
            setLoading(false)
        })
    }, [])

    const disableData = (day: unknown, component: string) => {
        if (component === 'calendar') {
            const a = day as { _d: Date }
            return unavailableDates.some(date => a._d.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0))
        } else {
            const a = day as Date
            return unavailableDates.some(date => a.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0))
        }
    }

    const onChangeDate = (value: unknown) => {
        const a = value as { _d: Date }
        onChange(getFormattedDate(a._d, 'year-month-day'))
    }

    if (loading) {
        return <Loader />
    } else {
        return (
            <div>
                <DateButtons>
                    <CalendarOpenButton
                        value=''
                        selected={isOpenCalendar}
                        onChange={() => setIsOpenCalendar(!isOpenCalendar)}
                        color='primary'
                    >
                        <CalendarMonthIcon />
                    </CalendarOpenButton>
                    <DayButtons
                        value={new Date(`${date}T00:00`)}
                        onChange={newDate => onChange(getFormattedDate(newDate, 'year-month-day'))}
                        maxDate={maxDate}
                        shouldDisableDate={day => disableData(day, 'buttons')}
                    />
                </DateButtons>
                <LocalizationProvider
                    dateAdapter={AdapterMoment}
                    adapterLocale='ru'
                >
                    <CalendarPicker
                        displayStaticWrapperAs="desktop"
                        minDate={new Date()}
                        maxDate={maxDate}
                        shouldDisableDate={day => disableData(day, 'calendar')}
                        value={new Date(`${date}T00:00`)}
                        onChange={onChangeDate}
                        renderInput={params => <TextField {...params} />}
                        isopen={isOpenCalendar}
                    />
                </LocalizationProvider>
            </div>
        )
    }
}