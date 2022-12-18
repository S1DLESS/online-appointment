import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getTime } from '../../http/clientAPI'


const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
    width: 100px;
`

interface Props {
    value: string
    onChange: (a: string) => void
    date: Date
    isDateError: boolean
    branchId: string
    masterId: string
    serviceId: string
}

export default function EditTimePicker({ value, onChange, date, isDateError, branchId, masterId, serviceId }: Props) {

    const [timeArr, setTimeArr] = useState([value])
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        setDisabled(true)
        if (new Date(date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
            const isInvalidDate = date ? date.toString() === 'Invalid Date' : true
            if (!isInvalidDate && !isDateError) {
                getTime(Date.parse(date.toString()), branchId, masterId, serviceId).then(res => {
                    if (res.timeArr) {
                        setTimeArr(res.timeArr)
                    }
                    setDisabled(false)
                })
            }
        }
    }, [date, masterId, serviceId])

    return (
        <StyledFormControl>
            <InputLabel id="time-label">Время</InputLabel>
            <Select
                labelId="time-label"
                value={value}
                label="Время"
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
            >
                {timeArr.map(time =>
                    <MenuItem key={time} value={time}>{time}</MenuItem>
                )}
            </Select>
        </StyledFormControl>
    )
}