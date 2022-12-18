import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'


const PageTitle = styled(Typography)`
    margin-bottom: 20px;
`

export default function AdminPageTitle() {

    const {pathname} = useLocation()

    const [title, setTitle] = useState('')

    const route = '/admin/dashboard'

    useEffect(() => {
        if (pathname === `${route}/appointments`) {
            setTitle('Записи')
        }
        if (pathname === `${route}/masters`) {
            setTitle('Специалисты')
        }
        if (pathname === `${route}/services`) {
            setTitle('Услуги')
        }
        if (pathname === `${route}/settings`) {
            setTitle('Настройки')
        }
        if (pathname === `${route}/customers`) {
            setTitle('Клиенты')
        }
        if (pathname === `${route}/discounts`) {
            setTitle('Настройка скидок')
        }
        if (pathname === `${route}/form`) {
            setTitle('Настройка формы онлайн-записи')
        }
    }, [pathname])


    return (
        <PageTitle variant='h4'>{title}</PageTitle>
    )
}