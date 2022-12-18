import React, { useContext, useState } from 'react'
import { Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { setToken } from '../../http'
import { login } from '../../http/userAPI'
import { Link } from 'react-router-dom'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AuthContext } from '../../context'

export default function Login() {

    const context = useContext(AuthContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const signIn = () => {
        setErrorMessage('')
        setLoading(true)
        login({ email, password }).then(res => {
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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div>
            <Typography
                variant='h3'
                style={{ textAlign: 'center' }}
            >Вход в учётную запись</Typography>
            <Typography
                style={{ marginTop: '30px' }}
            >Новый пользователь? <Link to='/admin/register' style={{ color: 'inherit' }}>Создать учетную запись</Link></Typography>
            <TextField
                disabled={loading}
                type='email'
                label="Адрес электронной почты"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                style={{ marginTop: '10px' }}
            />
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
                                onClick={handleClickShowPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                }}
                fullWidth
                style={{ marginTop: '10px' }}
            />
            <Button
                disabled={loading}
                onClick={signIn}
                variant='contained'
                fullWidth
                style={{ marginTop: '10px', marginBottom: '10px' }}
            >Войти</Button>
            {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
            <Typography style={{ textAlign: 'right' }}>
                <Link to='/admin/reset-password' style={{ color: 'inherit' }}>Забыли пароль?</Link>
            </Typography>
        </div>
    )
}