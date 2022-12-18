import { Visibility, VisibilityOff } from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton'
import { IconButton, InputAdornment, Tab, Tabs, TextField, Typography } from '@mui/material'
import React, { FC, useState } from 'react'
import InputMask from 'react-input-mask'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { setClientToken } from '../../http'
import { getAuthCode, loginWithPassword, sendAuthCode } from '../../http/customerAPI'
import { updateCustomerData } from '../../store/actions'
import { getPhoneFromMaskField } from '../../utils/validation'


const TabPanel = styled.div`
    display: flex;
    flex-direction: column;
`

interface Props {
    onLogin: () => void
}

export default function ClientAuth({ onLogin }: Props) {

    const { branch } = useAppSelector(state => state.client)
    const dispatch = useAppDispatch()

    const [tab, setTab] = useState(0)
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [codeEntry, setCodeEntry] = useState(false)
    const [code, setCode] = useState('')


    const handleSubmit = () => {
        setLoading(true)
        if (tab === 0) {
            if (codeEntry) {
                sendAuthCode(getPhoneFromMaskField(`${phone}`), { code }, branch._id).then(res => {
                    if (res.token) {
                        setClientToken(res.token)
                        dispatch(updateCustomerData({ ...res.customer, records: res.records }))
                        onLogin()
                    } else {
                        setErrorMessage(res.message)
                    }
                    setLoading(false)
                })
            } else {
                getAuthCode(getPhoneFromMaskField(`${phone}`)).then(res => {
                    if (res.ok) {
                        setCodeEntry(true)
                        console.log(res.code)
                    } else {
                        setErrorMessage(res.message)
                    }
                    setLoading(false)
                })
            }
        }
        if (tab === 1) {
            loginWithPassword({ email, password }, branch._id).then(res => {
                if (res.token) {
                    setClientToken(res.token)
                    dispatch(updateCustomerData({ ...res.customer, records: res.records }))
                    onLogin()
                } else {
                    setErrorMessage(res.message)
                }
                setLoading(false)
            })
        }
    }

    return (
        <div>
            <Tabs
                value={tab}
                onChange={(e, newTab) => setTab(newTab)}
                variant='fullWidth'
                style={{ marginBottom: '16px' }}
            >
                <Tab label="Вход по коду" />
                <Tab label="Вход с паролем" />
            </Tabs>
            <div role='tabpanel' hidden={tab !== 0}>
                <TabPanel>
                    <Typography>Введите номер телефона</Typography>
                    <InputMask
                        mask='+375 (99) 999-99-99'
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    >
                        <TextField label='Телефон' style={{ marginTop: '10px' }} />
                    </InputMask>
                    {codeEntry &&
                        <TextField
                            label='Код'
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            style={{ marginTop: '10px' }}
                        />
                    }
                    <LoadingButton
                        loading={loading}
                        onClick={handleSubmit}
                        variant='contained'
                        style={{ marginTop: '10px' }}
                    >{codeEntry ? 'Войти' : 'Получить код'}</LoadingButton>
                </TabPanel>
            </div>
            <div role='tabpanel' hidden={tab !== 1}>
                <TabPanel>
                    <Typography>Если у вас уже есть адрес электронной почты и пароль, введите их ниже</Typography>
                    <TextField
                        label='Адрес электронный почты'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ marginTop: '10px' }}
                    />
                    <TextField
                        label='Пароль'
                        type={showPassword ? 'text' : 'password'}
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
                        style={{ marginTop: '10px' }}
                    />
                    <LoadingButton
                        loading={loading}
                        onClick={handleSubmit}
                        variant='contained'
                        style={{ marginTop: '10px' }}
                    >Войти</LoadingButton>
                </TabPanel>
            </div>
            {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
        </div>
    )
}