import LoadingButton from '@mui/lab/LoadingButton'
import { TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context'
import { setToken } from '../../http'
import { resetPassword } from '../../http/userAPI'

export default function NewPassword() {

    const context = useContext(AuthContext)

    const { token } = useParams()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const updatePassword = () => {
        setLoading(true)
        resetPassword({ password }, token || '').then(res => {
            if (res.token) {
                setToken(res.token)
                context.setLoading(true)
                context.setHasToken(true)
            } else {
                setErrorMessage(res.message)
            }
            setLoading(false)
        })
    }

    return (
        <div>
            <Typography
                variant='h3'
                style={{ textAlign: 'center' }}
            >Создание нового пароля</Typography>
            <TextField
                disabled={loading}
                label="Новый пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                style={{ marginTop: '30px' }}
            />
            <TextField
                disabled={loading}
                label="Подтвердите новый пароль"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                fullWidth
                style={{ marginTop: '10px' }}
            />
            {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
            <LoadingButton
                loading={loading}
                onClick={updatePassword}
                variant='contained'
                fullWidth
                style={{ marginTop: '30px', marginBottom: '10px' }}
            >Обновить пароль</LoadingButton>
        </div>
    )
}