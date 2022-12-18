import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getMasters } from '../../http/masterAPI'
import { IMaster } from '../../models/IMaster'
import { setTimeToDate } from '../../utils/date'


const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
`

interface Props {
    value: IMaster
    onChange: (a: string) => void
    branchId: string
    date: Date
    isDateError: boolean
    time: string
    serviceId: string
}

export default function EditMasterPicker({ value, onChange, branchId, date, isDateError, time, serviceId }: Props) {

    const [masters, setMasters] = useState([value || { _id: '', name: '' }])
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        setDisabled(true)
        if (new Date(date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
            const isInvalidDate = date ? date.toString() === 'Invalid Date' : true
            if (!isInvalidDate && !isDateError) {
                const timestamp = date ? setTimeToDate(date, time) : 0
                getMasters(serviceId, timestamp, branchId).then(res => {
                    if (res.masters) {
                        setMasters(res.masters)
                    }
                    setDisabled(false)
                })
            }
        }
    }, [date, time, serviceId])

    return (
        <StyledFormControl>
            <InputLabel id="master-select-label">Специалист</InputLabel>
            <Select
                labelId="master-select-label"
                value={value ? value._id : ''}
                label="Специалист"
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
            >
                {masters.map(master =>
                    <MenuItem key={master._id} value={master._id}>{master.name}</MenuItem>
                )}
            </Select>
        </StyledFormControl>
    )
}