import { Checkbox, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { createRecord } from '../../http/recordAPI';
import LoadingButton from '@mui/lab/LoadingButton'
import InputMask from 'react-input-mask'
import { getPhoneFromMaskField } from '../../utils/validation';
import Loader from '../../components/UI/Loader';
import styled from 'styled-components'
import Ordered from '../../components/UI/Ordered';
import { updateClientData } from '../../store/actions'
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';


const StyledTextField = styled(TextField)`
    margin-top: 10px;
`

export default function AppointmentRecordPage() {

    const { selectedMaster, selectedService, selectedDate, branch } = useAppSelector(state => state.client)
    const dispatch = useAppDispatch()

    const [record, setRecord] = useState({
        name: '',
        phone: '',
        email: '',
        comment: ''
    })
    const [selected, setSelected] = useState({
        master: selectedMaster,
        service: selectedService,
        date: selectedDate
    })
    const [errorName, setErrorName] = useState(false)
    const [errorPhone, setErrorPhone] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [sendConfirm, setSendConfirm] = useState(false)
    const [errorMail, setErrorMail] = useState(false)

    const validateForm = () => {
        setErrorName(false)
        setErrorPhone(false)

        const phoneNumber = getPhoneFromMaskField(record.phone)

        if (!phoneNumber || phoneNumber.length < 9) {
            setErrorPhone(true)
        }
        if (!record.name) {
            setErrorName(true)
        }

        return {
            status: phoneNumber && phoneNumber.length === 9 && record.name,
            phone: phoneNumber
        }
    }

    const handleAppointment = () => {
        setErrorMail(false)
        if (sendConfirm && !record.email) {
            setErrorMail(true)
            return
        }
        const form = validateForm()
        if (form.status) {
            setLoading(true)
            createRecord({
                name: record.name,
                phone: form.phone,
                email: record.email,
                comment: record.comment,
                date: selectedDate,
                master_id: selectedMaster._id,
                service_id: selectedService._id,
                is_service_discounted: selectedService.has_discount,
                discount_percent: selectedService.has_discount
                    ? selectedService.discount_type === 'Скидка в день рождения'
                        ? branch.birthday_discount_settings.percent
                        : branch.discount_settings.percent
                    : 0,
                discount_type: selectedService.discount_type
            }, branch._id, sendConfirm ? 'email' : '').then(res => {
                if (res.records) {
                    setIsCompleted(true)
                    dispatch(updateClientData({
                        selectedMaster: {},
                        selectedService: {},
                        selectedDate: new Date(0)
                    }))
                } else {
                    setErrorMessage(res.message)
                }
                setLoading(false)
            })
        }
    }

    if (loading) {
        return <Loader />
    }

    if (!isCompleted) {
        return (
            <>
                <StyledTextField
                    required
                    label='Имя'
                    value={record.name}
                    onChange={e => setRecord({ ...record, name: e.target.value })}
                    error={errorName}
                    helperText={errorName ? 'Поле должно быть заполнено' : undefined}
                    fullWidth
                />
                <InputMask
                    mask='+375 (99) 999-99-99'
                    value={record.phone}
                    onChange={e => setRecord({ ...record, phone: e.target.value })}
                >
                    <StyledTextField
                        required
                        label='Телефон'
                        error={errorPhone}
                        helperText={errorPhone ? 'Поле должно быть заполнено' : undefined}
                        fullWidth
                    />
                </InputMask>
                <StyledTextField
                    required={sendConfirm}
                    label='Адрес электронной почты'
                    value={record.email}
                    onChange={e => setRecord({ ...record, email: e.target.value })}
                    fullWidth
                    error={errorMail}
                    helperText={errorMail ? 'Поле должно быть заполнено' : undefined}
                />
                <StyledTextField
                    label='Комментарий к записи'
                    value={record.comment}
                    onChange={e => setRecord({ ...record, comment: e.target.value })}
                    fullWidth
                />
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={sendConfirm}
                                onChange={e => setSendConfirm(e.target.checked)}
                            />
                        }
                        label="Отправить подтверждение на почту"
                    />
                </FormGroup>
                <LoadingButton
                    loading={loading}
                    variant='contained'
                    onClick={handleAppointment}
                    fullWidth
                >Записаться</LoadingButton>
                {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
            </>
        )
    } else {
        return (
            <Ordered
                master={selected.master}
                service={selected.service}
                date={selected.date}
            />
        )
    }
}