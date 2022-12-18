import { Button, TextField, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { reset } from '../../http/userAPI'
import styled from 'styled-components'


interface ReturnLinkStypedProps {
    primarytextcolor: string
}
const ReturnLinkTypography = styled(Typography)`
    margin-top: 20px;
    text-align: center;
`

const ReturnLink = styled(Link) <ReturnLinkStypedProps>`
    text-decoration: none;
    color: ${props => props.primarytextcolor};
    &:hover {
        text-decoration: underline;
    }
`
export default function ResetPassword() {

    const theme = useTheme()

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [sendSuccess, setSendSuccess] = useState(false)

    const sendRequest = () => {
        setErrorMessage('')
        setLoading(true)
        reset({ email }).then(res => {
            if (res.ok) {
                setSendSuccess(true)
            } else {
                setErrorMessage(res.message)
            }
            setLoading(false)
        })
    }

    if (!sendSuccess) {
        return (
            <div>
                <Typography
                    variant='h3'
                    style={{ textAlign: 'center' }}
                >Забыли пароль?</Typography>
                <Typography
                    color='textSecondary'
                    style={{ marginTop: '30px', textAlign: 'center' }}
                >Введите, пожалуйста, ваш адрес электронной почты на который была зарегистрирована учетная запись и мы вышлем вам ссылку на восстановление пароля</Typography>
                <TextField
                    disabled={loading}
                    label="Адрес электронной почты"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    style={{ marginTop: '10px' }}
                />
                {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
                <Button
                    disabled={loading}
                    onClick={sendRequest}
                    variant='contained'
                    fullWidth
                    style={{ marginTop: '10px', marginBottom: '10px' }}
                >Отправить запрос</Button>
                <ReturnLinkTypography>
                    <ReturnLink
                        to='/admin/login'
                        primarytextcolor={theme.palette.text.primary}
                    >&lt; Вернуться на страницу входа</ReturnLink>
                </ReturnLinkTypography>
            </div>
        )
    } else {
        return (
            <div>
                <Typography
                    variant='h3'
                    style={{ textAlign: 'center' }}
                >Запрос отправлен!</Typography>
                <Typography
                    color='textSecondary'
                    style={{ marginTop: '30px', textAlign: 'center' }}
                >На вашу почту {email} отправлена ссылка для изменения пароля.</Typography>
            </div>
        )
    }
}