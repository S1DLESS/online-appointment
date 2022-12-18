import LoadingButton from '@mui/lab/LoadingButton'
import { TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context'
import { deleteAccount } from '../http/userAPI'
import styled from 'styled-components'
import { useAppSelector } from '../hooks/useAppSelector'


const Container = styled.div`
    max-width: 300px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
`

export default function DeleteAccount() {

    const { user } = useAppSelector(state => state.admin)

    const { setHasToken } = useContext(AuthContext)

    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleDelete = () => {
        setErrorMessage('')
        setLoading(true)
        deleteAccount({ password }, user._id).then(res => {
            if (res.ok) {
                setHasToken(false)
            } else {
                setErrorMessage(res.message)
            }
        })
        setLoading(false)
    }
    return (
        <Container>
            <Typography>Удаление аккаунта приведет к удалению всей информации о филиалах, специалистах, услугах и записях. Введите ваш пароль.</Typography>
            <TextField
                label='Пароль'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
            />
            <LoadingButton
                loading={loading}
                variant='contained'
                color='error'
                onClick={handleDelete}
                fullWidth
            >Удалить аккаунт</LoadingButton>
            {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
        </Container>
    )
}