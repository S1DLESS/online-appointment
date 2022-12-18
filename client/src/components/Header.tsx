import { IconButton, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';


const Container = styled.header`
    position: relative;
    background-color: #fff;
    padding: 10px 0;
    text-align: center;
`

const LeftButton = styled(IconButton)`
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
`

const RightButton = styled(IconButton)`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
`

export default function Header() {

    const theme = useTheme()

    const { pathname } = useLocation()
    const navigate = useNavigate()

    const branch = useAppSelector(state => state.client.branch)

    const [title, setTitle] = useState('')
    const [hasLeftButton, setHasLeftButton] = useState(false)
    const [hasRightButton, setHasRightButton] = useState(false)
    const [isAboutLink, setIsAboutLink] = useState(false)

    useEffect(() => {
        let pathArr = pathname.match(/\w+/g) || []
        pathArr.splice(0, 1)

        if (!pathArr[0]) {
            setIsAboutLink(true)
            setHasLeftButton(false)
            setTitle(`${branch.title}`)
            setHasRightButton(true)
        }
        if (pathArr[0] === 'master') {
            setIsAboutLink(false)
            setHasLeftButton(true)
            setTitle('Выбрать специалиста')
            setHasRightButton(false)
        }
        if (pathArr[0] === 'service') {
            setIsAboutLink(false)
            setHasLeftButton(true)
            setTitle('Выбрать услугу')
            setHasRightButton(false)
        }
        if (pathArr[0] === 'time') {
            setIsAboutLink(false)
            setHasLeftButton(true)
            setTitle('Выбрать дату и время')
            setHasRightButton(false)
        }
        if (pathArr[0] === 'record') {
            setIsAboutLink(false)
            setHasLeftButton(true)
            setTitle('Оформление записи')
            setHasRightButton(false)
        }
        if (pathArr[0] === 'client') {
            setIsAboutLink(false)
            setHasLeftButton(true)
            setTitle('Личный кабинет')
            setHasRightButton(false)
        }
        if (pathArr[0] === 'about') {
            setIsAboutLink(false)
            setHasLeftButton(true)
            setTitle('О филиале')
            setHasRightButton(false)
        }
    }, [pathname])

    return (
        <Container>
            {hasLeftButton &&
                <LeftButton onClick={() => navigate(`/${branch._id}`)}><ArrowBackIcon /></LeftButton>
            }
            {isAboutLink
                ? <Link to='about' style={{ textDecoration: 'none' }}>
                    <Typography variant='h4'>{title} <ArrowForwardIosIcon fontSize='small' style={{ position: 'absolute', top: '19px', color: theme.palette.primary.main, transform: 'translateX(5px)' }} /></Typography>
                </Link>
                : <Typography variant='h4'>{title}</Typography>
            }
            {hasRightButton &&
                <RightButton onClick={() => navigate(`/${branch._id}/client`)}><PersonIcon /></RightButton>
            }
        </Container>
    )
}