import React, { useContext, useRef, useState } from 'react'
import { Button, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { createMaster, editMaster } from '../../http/masterAPI'
import { AdminContext } from '../../context'
import { updateAdminData } from '../../store/actions'
import styled from 'styled-components'
import { IMaster } from '../../models/IMaster'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { SelectChangeEvent } from '@mui/material/Select'


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

const StyledButton = styled(Button<'label'>)`
    margin-top: 10px;
`

const StyledLoadingButton = styled(LoadingButton)`
    margin-top: 10px;
`

const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
`

interface Props {
    type: string
    data?: IMaster
    onCloseModal: () => void
}

export default function MasterEdit({ type, data, onCloseModal }: Props) {

    const state = useAppSelector(state => state.admin)
    const dispatch = useAppDispatch()

    const [master, setMaster] = useState({
        id: data ? data._id : '',
        name: data ? data.name : '',
        description: data ? data.description : '',
        position: data ? data.position : '',
        avatar: {} as File,
        serviceId: data ? data.service_ids : []
    })
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { branchId } = useContext(AdminContext)

    const handleChangeService = (event: SelectChangeEvent<string[]>) => {
        const { target: { value } } = event
        setMaster({ ...master, serviceId: typeof value === 'string' ? value.split(',') : value })
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setErrorMessage('')
        setLoading(true)

        const formData = new FormData()

        formData.append('name', master.name)
        formData.append('description', master.description)
        formData.append('position', master.position)
        if (master.avatar) {
            formData.append('avatar', master.avatar)
        }
        if (master.serviceId.length) {
            master.serviceId.forEach((value, index) => formData.append('service_ids', master.serviceId[index]))
        }

        if (type === 'add') {
            createMaster(formData, branchId).then(res => {
                if (res.masters) {
                    dispatch(updateAdminData(res))
                    onCloseModal()
                } else {
                    setErrorMessage(res.message)
                }
            })
        }

        if (type === 'edit') {
            editMaster(formData, master.id, branchId).then(res => {
                if (res.masters) {
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
        const servicesTitles = selected.map(serviceId => {
            const service = state.services.find(el => el._id === serviceId)
            return service ? service.title : ''
        })
        return servicesTitles.join(', ')
    }

    return (
        <Container>
            <StyledTextField
                label='Имя'
                value={master.name}
                onChange={e => setMaster({ ...master, name: e.target.value })}
            />
            <StyledTextField
                label='Описание'
                value={master.description}
                onChange={e => setMaster({ ...master, description: e.target.value })}
            />
            <StyledTextField
                label='Должность'
                value={master.position}
                onChange={e => setMaster({ ...master, position: e.target.value })}
            />
            <StyledButton variant="contained" component="label">
                Загрузить аватарку
                <input
                    type="file"
                    hidden
                    accept="image/jpeg, image/png"
                    onChange={e => setMaster({ ...master, avatar: e.target.files ? e.target.files[0] : {} as File })}
                />
            </StyledButton>
            {master.avatar && <Typography>{master.avatar.name}</Typography>}
            <StyledFormControl>
                <InputLabel id="services-label">Услуги</InputLabel>
                <Select
                    labelId="services-label"
                    multiple
                    value={master.serviceId}
                    onChange={handleChangeService}
                    input={<OutlinedInput label="Услуги" />}
                    renderValue={renderSelectValue}
                // MenuProps={MenuProps}
                >
                    {state.services.map(service => (
                        <MenuItem key={service._id} value={service._id}>
                            <Checkbox checked={master.serviceId.indexOf(service._id) > -1} />
                            <ListItemText primary={service.title} />
                        </MenuItem>
                    ))}
                </Select>
            </StyledFormControl>
            <StyledLoadingButton
                disabled={!master.name}
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