import { Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Loader from '../../components/UI/Loader'
import { getCustomerRecords } from '../../http/customerAPI'
import { editCustomerData } from '../../http/customerAPI'
import { getFormattedDate, getFormattedTime } from '../../utils/date'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoadingButton from '@mui/lab/LoadingButton'
import LogoutIcon from '@mui/icons-material/Logout';
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'
import { updateCustomerData } from '../../store/actions'
import { deleteClientToken } from '../../http'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'


const RecordInfo = styled.div`
    padding: 5px;
    background-color: #fff;
    margin: 10px 0;
    border-radius: 1rem;
`

const EditForm = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    row-gap: 10px;
`

interface Props {
    onLogout: () => void
}

export default function ClientProfile({ onLogout }: Props) {

    const { customer, client } = useAppSelector(state => state)
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [updateErrorMessage, setUpdateErrorMessage] = useState('')

    const [birthdate, setBirthdate] = useState(customer.birthdate)
    const [email, setEmail] = useState(customer.email[0])
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [recordsLoading, setRecordsLoading] = useState(true)
    const [recordsErrorMessage, setRecordsErrorMessage] = useState('')
    const [records, setRecords] = useState([{
        id: '',
        date: '',
        master: '',
        service: '',
        price: '',
        comment: ''
    }])

    useEffect(() => {
        getCustomerRecords(customer._id).then(res => {
            if (res.records) {
                setRecords(res.records)
            } else {
                setRecordsErrorMessage(res.message)
            }
            setRecordsLoading(false)
        })
    }, [customer._id])

    const handleSubmit = () => {
        setLoading(true)
        editCustomerData({ birthdate, email, password }, customer._id).then(res => {
            if (res.customer) {
                dispatch(updateCustomerData(res.customer))
            } else {
                setUpdateErrorMessage(res.message)
            }
            setLoading(false)
        })
    }

    const logout = () => {
        deleteClientToken()
        onLogout()
    }

    return (
        <div>
            <EditForm>
                <Typography>Имя: {customer.name[0]}</Typography>
                <Typography>Телефон: +375{customer.phone}</Typography>
                <TextField
                    label='E-mail'
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        label="День рождения"
                        value={Date.parse(birthdate.toString()) !== 0 ? birthdate : null}
                        onChange={newValue => {
                            const a = newValue as { _d: Date } | null
                            setBirthdate(a ? a._d : new Date(0))
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <TextField
                    disabled={loading}
                    type={showPassword ? 'text' : 'password'}
                    label="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                    }}
                    fullWidth
                />
                {updateErrorMessage && <Typography color='error'>{updateErrorMessage}</Typography>}
                <LoadingButton
                    disabled={birthdate && birthdate.toString() === 'Invalid Date'}
                    loading={loading}
                    onClick={handleSubmit}
                    variant='contained'
                >Сохранить</LoadingButton>
                <Button onClick={logout} color='error' variant='outlined'>Выйти</Button>
            </EditForm>
            <Typography variant='h6' style={{ marginTop: '20px', textAlign: 'center' }}>Записи в {client.branch.title}</Typography>
            {recordsErrorMessage && <Typography color='error'>{recordsErrorMessage}</Typography>}
            {recordsLoading
                ? <Loader />
                : records.map(record =>
                    <RecordInfo key={record.id}>
                        <Typography>{getFormattedDate(new Date(record.date), 'weekDay, day month')}, {getFormattedTime(new Date(record.date))}</Typography>
                        <Typography><strong>Специалист:</strong> {record.master}</Typography>
                        <Typography><strong>Услуга:</strong> {record.service}</Typography>
                        <Typography><strong>Стоимость:</strong> {record.price}</Typography>
                        <Typography><strong>Комментарий:</strong> {record.comment}</Typography>
                    </RecordInfo>
                )
            }
        </div>
    )
}