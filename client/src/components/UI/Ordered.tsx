import { Avatar, Typography } from '@mui/material'
import React from 'react'
import { getMonthName, getFormattedTime, getWeekDay } from '../../utils/date'
import styled from 'styled-components'
import { getAvatarProps } from '../../utils/avatar'
import { IMaster } from '../../models/IMaster'
import { IService } from '../../models/IService'


const Header = styled(Typography)`
    font-size: 24px;
    text-align: center;
`

const Container = styled.div`
    padding: 10px;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 1rem;
`

const Info = styled.div`
    display: flex;
    align-items: center;
`

interface Props {
    master: IMaster
    service: IService
    date: Date
}

export default function Ordered({ master, service, date }: Props) {
    const startTime = getFormattedTime(date)
    const end = new Date(Date.parse(date.toString()) + service.duration + 1)
    const endTime = getFormattedTime(end)
    const weekDay = getWeekDay(date.getDay())
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    const month = getMonthName(date.getMonth())

    return (
        <div>
            <Header variant='h2'>Вы записаны!</Header>
            <Typography style={{ textAlign: 'center' }}>{weekDay}, {day} {month}, {startTime} - {endTime}</Typography>
            <Container>
                <Typography>Специалист:</Typography>
                <hr />
                <Info>
                    <Avatar {...getAvatarProps(master.avatar_url, master.name, 'master')} />
                    <Typography>{master.name}</Typography>
                </Info>
            </Container>
            <Container>
                <Typography>Услуга:</Typography>
                <hr />
                <Info>
                    <Typography>{service.title}</Typography>
                </Info>
            </Container>
        </div>
    )
}