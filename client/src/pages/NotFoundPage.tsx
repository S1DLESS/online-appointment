import { Button, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'


const Container = styled.div`
    text-align: center;
`

const Header = styled(Typography)`
    margin-top: 100px;
`

const Message = styled(Typography)`
    margin-top: 20px;
`

const HomeButton = styled(Button<typeof Link>)`
    margin: 50px auto 0;
`

export default function NotFoundPage() {
    return (
        <Container>
            <Header variant='h3'>Филиал не найден!</Header>
            <Message variant='body1' color='textSecondary'>Возможно, вы перешли по неправильной ссылке или данного филиала не существует.</Message>
            <HomeButton component={Link} to='/' variant='contained'>Вернуться на главную страницу</HomeButton>
        </Container>
    )
}