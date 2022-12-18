import { FormControl, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { useContext, useEffect, useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdminContext } from '../../context';
import LoadingButton from '@mui/lab/LoadingButton';
import { createRecord, editRecord } from '../../http/recordAPI';
import { updateAdminData } from '../../store/actions'
import InputMask from 'react-input-mask';
import { getPhoneFromMaskField } from '../../utils/validation';
import styled from 'styled-components'
import { getUnavailableDates } from '../../http/clientAPI';
import EditTimePicker from './EditTimePicker';
import EditDatePicker from './EditDatePicker';
import EditMasterPicker from './EditMasterPicker';
import EditServicePicker from './EditServicePicker';
import { getFormattedTime } from '../../utils/date';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { IRecord } from '../../models/IRecord';


const Container = styled.div`
    display: flex;
    flex-direction: column;
`

const StyledTextField = styled(TextField)`
    margin-top: 10px;
    width: 300px;

    &:first-child {
        margin-top: 0;
    }
`

const StyledLoadingButton = styled(LoadingButton)`
    margin-top: 10px;
`

const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
`

interface Props {
    type: string
    data?: IRecord
    onCloseModal: () => void
}

export default function AppointmentEdit({ type, data, onCloseModal }: Props) {

    const state = useAppSelector(state => state.admin)
    const dispatch = useAppDispatch()

    const [record, setRecord] = useState({
        id: data ? data._id : '',
        name: data ? data.name : '',
        phone: data ? data.phone : '',
        email: data ? data.email : '',
        comment: data ? data.comment : '',
        date: data ? data.date : new Date(0),
        time: data ? getFormattedTime(data.date) : '',
        masterId: data ? data.master_id : '',
        serviceId: data ? data.service_id : ''
    })

    const [errorName, setErrorName] = useState(false)
    const [errorPhone, setErrorPhone] = useState(false)
    const [datePickerError, setDatePickerError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { branchId } = useContext(AdminContext)

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

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        // e.preventDefault()
        setErrorMessage('')
        setLoading(true)

        const form = validateForm()
        if (form.status) {
            if (type === 'add') {
                createRecord({
                    name: record.name,
                    phone: form.phone,
                    email: record.email,
                    comment: record.comment,
                    date: record.date,
                    master_id: record.masterId,
                    service_id: record.serviceId,
                    is_service_discounted: false,
                    discount_percent: 0,
                    discount_type: ''
                }, branchId, '').then(res => {
                    if (res.records) {
                        dispatch(updateAdminData(res))
                        onCloseModal()
                    } else {
                        setErrorMessage(res.message)
                    }
                })
            }

            if (type === 'edit') {
                editRecord({
                    name: record.name,
                    phone: form.phone,
                    email: record.email,
                    comment: record.comment,
                    date: record.date,
                    master_id: record.masterId,
                    service_id: record.serviceId,
                    is_service_discounted: false,
                    discount_percent: 0,
                    discount_type: ''
                }, record.id, branchId).then(res => {
                    if (res.records) {
                        dispatch(updateAdminData(res))
                        onCloseModal()
                    } else {
                        setErrorMessage(res.message)
                    }
                })
            }
        }
        setLoading(false)
    }

    return (
        <Container>
            <StyledTextField
                required
                label="Имя"
                value={record.name}
                onChange={e => setRecord({ ...record, name: e.target.value })}
                error={errorName}
                helperText={errorName ? 'Поле должно быть заполнено' : undefined}
            />
            <InputMask
                mask='+375 (99) 999-99-99'
                value={record.phone}
                onChange={e => setRecord({ ...record, phone: e.target.value })}
            >
                <StyledTextField
                    required
                    label="Номер телефона"
                    error={errorPhone}
                    helperText={errorPhone ? 'Поле должно быть заполнено' : undefined}
                />
            </InputMask>
            <StyledTextField
                label="Адрес электронной почты"
                value={record.email}
                onChange={e => setRecord({ ...record, email: e.target.value })}
            />
            <StyledTextField
                label="Комментарий"
                value={record.comment}
                onChange={e => setRecord({ ...record, comment: e.target.value })}
            />
            <div style={{ display: 'flex', columnGap: '10px' }}>
                <EditDatePicker
                    value={record.date}
                    onChange={date => setRecord({ ...record, date })}
                    onError={reason => setDatePickerError(!!reason)}
                    branchId={branchId}
                    masterId={record.masterId}
                    serviceId={record.serviceId}
                />
                <EditTimePicker
                    value={record.time}
                    onChange={time => setRecord({ ...record, time })}
                    isDateError={datePickerError}
                    branchId={branchId}
                    date={record.date}
                    masterId={record.masterId}
                    serviceId={record.serviceId}
                />
            </div>
            <EditMasterPicker
                value={state.masters.find(master => master._id === record.masterId) || state.masters[0]}
                onChange={masterId => setRecord({ ...record, masterId })}
                isDateError={datePickerError}
                branchId={branchId}
                date={new Date(record.date)}
                time={record.time}
                serviceId={record.serviceId}
            />
            <EditServicePicker
                value={state.services.find(service => service._id === record.serviceId) || state.services[0]}
                onChange={serviceId => setRecord({ ...record, serviceId })}
                isDateError={datePickerError}
                branchId={branchId}
                date={new Date(record.date)}
                time={record.time}
                masterId={record.masterId}
            />
            <StyledLoadingButton
                disabled={datePickerError || !record.name || !record.phone || !record.masterId || !record.serviceId}
                loading={loading}
                variant='outlined'
                onClick={handleSubmit}
            >
                {type === 'add' ? 'Создать' : 'Редактировать'}
            </StyledLoadingButton>
            {errorMessage && <Typography>{errorMessage}</Typography>}
        </Container>
    )
}