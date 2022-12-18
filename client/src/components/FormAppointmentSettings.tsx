import { IconButton, Paper, TextField, Tooltip, Typography } from '@mui/material'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AdminContext } from '../context'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LoadingButton from '@mui/lab/LoadingButton'
import { editAppointmentBranch } from '../http/branchAPI'
import { updateAdminData } from '../store/actions'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { IBranch } from '../models/IBranch'


const Container = styled(Paper)`
    margin-top: 10px;
    padding: 10px;
    width: 320px;
    max-width: 100%;
`

const LinkToForm = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    column-gap: 10px;
`

const LinkField = styled(TextField)`
    width: 100%;
`

const Settings = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    row-gap: 15px;
`

const SubmitButton = styled(LoadingButton)`
    margin-top: 10px;
`

export default function FormAppointmentSettings() {

    const { branchId } = useContext(AdminContext)

    const formLink = `${process.env.REACT_APP_API_URL}${branchId}`
    const branches = useAppSelector(state => state.admin.branches)
    const dispatch = useAppDispatch()
    const { appointment_settings } = branches.find(branch => branch._id === branchId) || {} as IBranch

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [timezone, setTimezone] = useState(appointment_settings.timezone)
    const [availableDays, setAvailableDays] = useState(appointment_settings.available_days)
    const [interval, setInterval] = useState(appointment_settings.interval / 60 / 1000)
    const [startTime, setStartTime] = useState(new Date(new Date().setHours(appointment_settings.start_time.hours, appointment_settings.start_time.minutes)))
    const [endTime, setEndTime] = useState(new Date(new Date().setHours(appointment_settings.end_time.hours, appointment_settings.end_time.minutes)))

    const handleSubmit = () => {
        setErrorMessage('')
        setLoading(true)
        editAppointmentBranch({
            timezone,
            available_days: availableDays,
            interval: interval * 60 * 1000,
            start_time: {
                hours: new Date(startTime).getHours(),
                minutes: new Date(startTime).getMinutes()
            },
            end_time: {
                hours: new Date(endTime).getHours(),
                minutes: new Date(endTime).getMinutes()
            }
        }, branchId).then(res => {
            if (res.branches) {
                dispatch(updateAdminData(res.branches))
            } else {
                setErrorMessage(res.message)
            }
            setLoading(false)
        })
    }

    const disabledBtn = !timezone || !availableDays || !interval || !startTime || !endTime

    return (
        <Container>
            <LinkToForm>
                <LinkField
                    type='url'
                    label="Ссылка на форму онлайн-записи"
                    defaultValue={formLink}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <Tooltip title='Копировать ссылку'>
                    <IconButton onClick={() => navigator.clipboard.writeText(formLink)}>
                        <ContentCopyIcon />
                    </IconButton>
                </Tooltip>
            </LinkToForm>
            <Settings>
                <TextField
                    label='Часовой пояс'
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    type='number'
                    label='Кол-во дней для записи'
                    value={availableDays}
                    onChange={e => setAvailableDays(+e.target.value)}
                />
                <TextField
                    type='number'
                    label='Интервал времени слотов (мин.)'
                    value={interval}
                    onChange={e => setInterval(+e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <TimePicker
                        label="Старт записи в"
                        value={startTime}
                        onChange={newValue => setStartTime(newValue || new Date(0))}
                        renderInput={params => <TextField {...params} />}
                    />
                    <TimePicker
                        label="Конец записи в"
                        value={endTime}
                        onChange={newValue => setEndTime(newValue || new Date(0))}
                        renderInput={params => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Settings>
            <SubmitButton
                variant='contained'
                disabled={disabledBtn}
                loading={loading}
                onClick={handleSubmit}
            >Сохранить</SubmitButton>
            {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
        </Container>
    )
}