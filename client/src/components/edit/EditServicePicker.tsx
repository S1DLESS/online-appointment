import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getServices } from '../../http/serviceAPI'
import { IService } from '../../models/IService'
import { setTimeToDate } from '../../utils/date'


const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
`

interface Props {
    value: IService
    onChange: (a: string) => void
    branchId: string
    date: Date
    isDateError: boolean
    time: string
    masterId: string
}

export default function EditServicePicker({ value, onChange, branchId, date, isDateError, time, masterId }: Props) {

    const [services, setServices] = useState([value || { _id: '', title: '' }])
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        setDisabled(true)
        if (new Date(date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
            const isInvalidDate = date ? date.toString() === 'Invalid Date' : true
            if (!isInvalidDate && !isDateError) {
                const timestamp = date ? setTimeToDate(date, time) : 0
                getServices(masterId, timestamp, branchId).then(res => {
                    if (res.services) {
                        setServices(res.services)
                    }
                    setDisabled(false)
                })
            }
        }
    }, [date, time, masterId])

    return (
        <StyledFormControl>
            <InputLabel id="service-select-label">Услуга</InputLabel>
            <Select
                labelId="service-select-label"
                value={value ? value._id : ''}
                label="Услуга"
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
            >
                {services.map(service =>
                    <MenuItem key={service._id} value={service._id}>{service.title}</MenuItem>
                )}
            </Select>
        </StyledFormControl>
    )
}