import { Button, Container as MuiContainer, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { getBranches } from '../http/branchAPI'


const Page = styled.div`
    height: 100vh;
    background-color: #f4f6f8;
`

const Header = styled.header`
    padding: 10px 0;
`

const Container = styled(MuiContainer)`
    display: flex;
    justify-content: space-between;
`

const Logo = styled.img`
    width: 40px;
`

const Links = styled.div`
    display: flex;
    align-items: center;
`

const LoginLink = styled(Typography<typeof Link>)`
    text-decoration: none;
    margin-right: 20px;
    transition: opacity .2s;
    &:hover {
        opacity: 0.5;
    }
`

const TextContainer = styled.div`
    text-align: center;
    margin-top: 20px;
`

const Title = styled(Typography)`
    margin-bottom: 10px;
`


export default function HomePage() {

    const [link, setLink] = useState('')

    useEffect(() => {
        getBranches().then(res => {
            if (res.branches) {
                setLink(res.branches[res.branches.length - 1]._id.toString())
            }
        })
    }, [])

    return (
        <Page>
            <Header>
                <Container maxWidth='lg'>
                    <Logo src={`${process.env.REACT_APP_API_URL}/logo.png`} alt='logo' />
                    <Links>
                        <LoginLink
                            component={Link}
                            to='/admin/login'
                            variant='subtitle2'
                        >Войти</LoginLink>
                        <Button
                            component={Link}
                            to='/admin/register'
                            variant='contained'
                        >Регистрация</Button>
                    </Links>
                </Container>
            </Header>
            <TextContainer>
                <Title
                    variant='h2'
                >Сервис онлайн-записи клиентов</Title>
                <Typography
                    variant='body1'
                >Перейдите по <a href={link} style={{ color: 'inherit' }}>ссылке</a> чтобы оформить онлайн запись.<br />Или зарегистрируйтесь и создайте свою онлайн-запись!</Typography>
            </TextContainer>
        </Page>
    )
}