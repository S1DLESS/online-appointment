import React, { useEffect, useState } from 'react'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import styled from 'styled-components'
import { getUnavailableDates } from '../../http/clientAPI';
import { DateValidationError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation';


const StyledTextField = styled(TextField)`
    margin-top: 10px;
    width: 190px;
`

interface Props {
    value: Date
    onChange: (date: Date) => void
    onError: (reason: DateValidationError) => void
    branchId: string
    masterId: string
    serviceId: string
}

export default function EditDatePicker({ value, onChange, onError, branchId, masterId, serviceId }: Props) {

    const [unavailableDates, setUnavailableDates] = useState<Date[]>([])
    const [maxDate, setMaxDate] = useState(new Date())
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        setDisabled(true)
        getUnavailableDates(
            branchId,
            masterId,
            serviceId
        ).then(res => {
            if (res.unavailableDates) {
                setUnavailableDates(res.unavailableDates)
                setMaxDate(new Date(res.maxDate))
            }
            setDisabled(false)
        })
    }, [masterId, serviceId])

    const disableDate = (day: unknown) => {
        const a = day as { _d: Date }
        const isUnavailableDate = unavailableDates.some(date => a._d.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0))
        if (!value) {
            return isUnavailableDate
        } else {
            const isDaysBetweenRecordingDayAndToday = a._d.setHours(0, 0, 0, 0) > new Date(value).setHours(0, 0, 0, 0) && a._d.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
            return isUnavailableDate || isDaysBetweenRecordingDayAndToday
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
                label="Дата"
                value={value || null}
                onChange={newDate => {
                    console.log()
                    const a = newDate as { _d: Date } | null
                    onChange(a ? a._d : new Date(0))
                }}
                renderInput={params => <StyledTextField {...params} />}
                onError={reason => onError(reason)}
                shouldDisableDate={disableDate}
                minDate={value ? new Date(value) : new Date()}
                maxDate={maxDate}
                disabled={disabled}
            />
        </LocalizationProvider>
    )
}