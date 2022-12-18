import LoadingButton from '@mui/lab/LoadingButton'
import { Button, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { AdminContext } from '../../context'
import { createService, editService } from '../../http/serviceAPI'
import { updateAdminData } from '../../store/actions'
import styled from 'styled-components'
import { IService } from '../../models/IService'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'


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

const StyledButton = styled(Button<'label'>)`
    margin-top: 10px;
`

interface Props {
    type: string
    data?: IService
    onCloseModal: () => void
}


export default function ServiceEdit({ type, data, onCloseModal }: Props) {

    const state = useAppSelector(state => state.admin)
    const dispatch = useAppDispatch()

    const [service, setService] = useState({
        id: data ? data._id : '',
        title: data ? data.title : '',
        duration: data ? (data.duration + 1) / 60 / 1000 : '',
        price: data ? data.price : '',
        description: data ? data.description : '',
        avatar: {} as File,
        masterId: data ? data.master_ids : []
    })
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { branchId } = useContext(AdminContext)

    const handleChangeMaster = (event: SelectChangeEvent<string[]>) => {
        const { target: { value } } = event
        setService({ ...service, masterId: typeof value === 'string' ? value.split(',') : value })
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setErrorMessage('')
        setLoading(true)

        const formData = new FormData()

        formData.append('title', service.title)
        formData.append('duration', `${+service.duration * 60 * 1000 - 1}`)
        formData.append('price', `${service.price}`)
        formData.append('description', service.description)
        if (service.avatar) {
            formData.append('avatar', service.avatar)
        }
        if (service.masterId.length) {
            service.masterId.forEach((value, index) => formData.append('master_ids', service.masterId[index]))
        }

        if (type === 'add') {
            createService(formData, branchId).then(res => {
                if (res.services) {
                    dispatch(updateAdminData(res))
                    onCloseModal()
                } else {
                    setErrorMessage(res.message)
                }
            })
        }

        if (type === 'edit') {
            editService(formData, service.id, branchId).then(res => {
                if (res.services) {
                    dispatch(updateAdminData(res))
                    onCloseModal()
                } else {
                    setErrorMessage(res.message)
                }
            })
        }
        setLoading(false)
    }

    const renderSelectValue = (selected: string[]) => {
        const mastersNames = selected.map(masterId => {
            const master = state.masters.find(el => el._id === masterId)
            return master ? master.name : ''
        })
        return mastersNames.join(', ')
    }

    return (
        <Container>
            <StyledTextField
                label='Название'
                value={service.title}
                onChange={e => setService({ ...service, title: e.target.value })}
            />
            <StyledTextField
                label='Длительность (в минутах)'
                value={service.duration}
                onChange={e => setService({ ...service, duration: e.target.value })}
            />
            <StyledTextField
                label='Цена'
                value={service.price}
                onChange={e => setService({ ...service, price: e.target.value })}
            />
            <StyledTextField
                label='Описание'
                value={service.description}
                onChange={e => setService({ ...service, description: e.target.value })}
            />
            <StyledButton variant="contained" component="label">
                Загрузить аватарку
                <input
                    type="file"
                    hidden
                    accept="image/jpeg, image/png"
                    onChange={e => setService({ ...service, avatar: e.target.files ? e.target.files[0] : {} as File })}
                />
            </StyledButton>
            {service.avatar && <Typography>{service.avatar.name}</Typography>}
            <StyledFormControl>
                <InputLabel id="masters-label">Специалисты</InputLabel>
                <Select
                    labelId="masters-label"
                    multiple
                    value={service.masterId}
                    onChange={handleChangeMaster}
                    input={<OutlinedInput label="Специалисты" />}
                    renderValue={renderSelectValue}
                // MenuProps={MenuProps}
                >
                    {state.masters.map(master => (
                        <MenuItem key={master._id} value={master._id}>
                            <Checkbox checked={service.masterId.indexOf(master._id) > -1} />
                            <ListItemText primary={master.name} />
                        </MenuItem>
                    ))}
                </Select>
            </StyledFormControl>
            <StyledLoadingButton
                disabled={!service.title || !service.duration || !service.price}
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