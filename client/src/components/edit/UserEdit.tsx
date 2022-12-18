import LoadingButton from '@mui/lab/LoadingButton'
import { TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { editUser } from '../../http/userAPI'
import { updateAdminData } from '../../store/actions'
import styled from 'styled-components'
import { IUser } from '../../models/IUser'
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

interface Props {
    data: IUser
    onCloseModal: () => void
}

export default function UserEdit({ data, onCloseModal }: Props) {

    const dispatch = useAppDispatch()

    const [user, setUser] = useState({
        id: data ? data._id : '',
        name: data ? data.name : '',
        email: data ? data.email : '',
        password: data ? data.password : '',
    })
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        setErrorMessage('')
        setLoading(true)

        editUser({
            name: user.name,
            email: user.email,
            password: user.password
        }, user.id).then(res => {
            if (res.user) {
                dispatch(updateAdminData(res))
                onCloseModal()
            } else {
                setErrorMessage(res.message)
            }
        })
        setLoading(false)
    }

    return (
        <Container>
            <StyledTextField
                label='Имя'
                value={user.name}
                onChange={e => setUser({ ...user, name: e.target.value })}
            />
            <StyledTextField
                required
                label='Адрес электронной почты'
                value={user.email}
                onChange={e => setUser({ ...user, email: e.target.value })}
            />
            <StyledTextField
                label='Пароль'
                type='password'
                value={user.password}
                onChange={e => setUser({ ...user, password: e.target.value })}
            />
            <StyledLoadingButton
                disabled={!user.email}
                loading={loading}
                variant='outlined'
                onClick={handleSubmit}
            >
                Редактировать
            </StyledLoadingButton>
            {errorMessage && <Typography>{errorMessage}</Typography>}
        </Container>
    )
}