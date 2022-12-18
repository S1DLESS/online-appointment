import { Button } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateClientData } from '../../store/actions'
import 'moment/locale/ru'
import TimePicker from '../../components/TimePicker'
import styled from 'styled-components'
import { getFormattedTime, setTimeToDate, getFormattedDate } from '../../utils/date'
import DatePicker from '../../components/DatePicker'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'


const SubmitButton = styled(Button)`
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
`

export default function AppointmentDateTimePage() {

    const navigate = useNavigate()

    const { selectedMaster, selectedService, selectedDate, branch } = useAppSelector(state => state.client)
    const dispatch = useAppDispatch()

    const hasDate = Date.parse(selectedDate.toString()) !== 0

    const [date, setDate] = useState(hasDate ? getFormattedDate(selectedDate, 'year-month-day') : '') // 'YYYY-MM-DD'
    const [time, setTime] = useState(hasDate ? getFormattedTime(selectedDate) : '') // 'HH:MM'


    const handleSubmitDate = () => {
        dispatch(updateClientData({
            selectedDate: new Date(setTimeToDate(new Date(date), time))
        }))
        navigate(-1)
    }

    return (
        <>
            <DatePicker
                date={date}
                onChange={setDate}
                masterId={selectedMaster._id}
                serviceId={selectedService._id}
                branchId={branch._id}
            />
            {date &&
                <TimePicker
                    date={date}
                    time={time}
                    onChange={setTime}
                    masterId={selectedMaster._id}
                    serviceId={selectedService._id}
                    branchId={branch._id}
                />
            }
            <SubmitButton
                disabled={!time || !date}
                variant='contained'
                onClick={handleSubmitDate}
                fullWidth
            >Продолжить</SubmitButton>
        </>
    )
}