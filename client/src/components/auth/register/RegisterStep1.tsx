import React, { useState } from 'react'
import { Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from 'styled-components'


const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
`

const Header = styled.div`
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

interface Props {
    username: string
    setUsername: (a: string) => void
    email: string
    setEmail: (a: string) => void
    password: string
    setPassword: (a: string) => void
    onChangeStep: (a: number) => void
}

export default function RegisterStep1({ username, setUsername, email, setEmail, password, setPassword, onChangeStep }: Props) {

    const [showPassword, setShowPassword] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)

    return (
        <Container>
            <Header>
                <div></div>
                <Typography variant='h5'>Шаг 1 из 3: Пользователь</Typography>
            </Header>
            <TextField
                label="Ваше имя"
                value={username}
                onChange={e => setUsername(e.target.value)}
                fullWidth
                style={{ marginTop: '10px' }}
            />
            <TextField
                required
                label="Адрес электронной почты"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                style={{ marginTop: '10px' }}
            />
            <TextField
                required
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
                style={{ marginTop: '10px' }}
            />
            <Button
                disabled={btnDisabled}
                onClick={() => onChangeStep(2)}
                variant='contained'
                fullWidth
                style={{ marginTop: '10px', marginBottom: '10px' }}
            >Далее</Button>
        </Container>
    )
}