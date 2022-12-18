import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Typography } from '@mui/material'
import { Groups, List, Event } from '@mui/icons-material'
import styled from 'styled-components'
import { updateClientData } from '../../store/actions'
import RecordMenuItem from '../../components/UI/RecordMenuItem'
import { getFormattedDate, getFormattedTime, getWeekDay } from '../../utils/date'
import { getAvatarProps } from '../../utils/avatar'
import { getServicePrice } from '../../utils/price'
import RecordMenuList from '../../components/UI/RecordMenuList'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'


const ConfirmButton = styled(Button<typeof Link>)`
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
`

export default function AppointmentMainPage() {

    const { selectedMaster, selectedService, selectedDate } = useAppSelector(state => state.client)
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const masterIsSelected = !!selectedMaster._id
    const serviceIsSelected = !!selectedService._id
    const dateIsSelected = Date.parse(selectedDate.toString()) !== 0

    const masterItemProps = masterIsSelected
        ? {
            avatarProps: { ...getAvatarProps(selectedMaster.avatar_url, selectedMaster.name, 'master') },
            primaryText: selectedMaster.name,
            secondaryText: selectedMaster.position
        }
        : {
            avatarProps: { children: <Groups /> },
            primaryText: 'Выбрать специалиста',
            secondaryText: ''
        }

    const serviceItemProps = serviceIsSelected
        ? {
            avatarProps: { ...getAvatarProps(selectedService.avatar_url, selectedService.title, 'service') },
            primaryText: selectedService.title,
            secondaryText: getServicePrice(selectedService)
        }
        : {
            avatarProps: { children: <List /> },
            primaryText: 'Выбрать услугу',
            secondaryText: ''
        }

    const dateItemProps = dateIsSelected
        ? {
            avatarProps: {
                children:
                    <Typography
                        variant='body2'
                        color='#fff'
                        style={{ textAlign: 'center', lineHeight: 1.15 }}
                    >
                        {getWeekDay(selectedDate.getDay(), true)}<br />{selectedDate.getDate()}
                    </Typography>
            },
            primaryText: getFormattedTime(selectedDate),
            secondaryText: getFormattedDate(selectedDate, 'weekDay, day month')
        }
        : {
            avatarProps: { children: <Event /> },
            primaryText: 'Выбрать дату и время',
            secondaryText: ''
        }

    const hasConfirmButton = masterIsSelected && serviceIsSelected && dateIsSelected

    return (
        <>
            <RecordMenuList>
                <RecordMenuItem
                    onClick={() => navigate('master')}
                    avatarProps={masterItemProps.avatarProps}
                    primaryText={masterItemProps.primaryText}
                    secondaryText={masterItemProps.secondaryText}
                    hasDeleteButton={masterIsSelected}
                    onDelete={() => dispatch(updateClientData({ selectedMaster: {} }))}
                />
                <RecordMenuItem
                    onClick={() => navigate('service')}
                    avatarProps={serviceItemProps.avatarProps}
                    primaryText={serviceItemProps.primaryText}
                    secondaryText={serviceItemProps.secondaryText}
                    hasDeleteButton={serviceIsSelected}
                    onDelete={() => dispatch(updateClientData({ selectedService: {} }))}
                />
                <RecordMenuItem
                    onClick={() => navigate('time')}
                    avatarProps={dateItemProps.avatarProps}
                    primaryText={dateItemProps.primaryText}
                    secondaryText={dateItemProps.secondaryText}
                    hasDeleteButton={dateIsSelected}
                    onDelete={() => dispatch(updateClientData({ selectedDate: new Date(0) }))}
                />
            </RecordMenuList>
            {hasConfirmButton &&
                <ConfirmButton
                    component={Link}
                    to='record'
                    variant='contained'
                    fullWidth
                >Продолжить</ConfirmButton>
            }
        </>
    )
}