import { Alert, AlertTitle } from '@mui/material'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getServices } from '../../http/serviceAPI'
import { updateClientData } from '../../store/actions'
import ListIcon from '@mui/icons-material/List';
import styled from 'styled-components'
import RecordMenuItem from '../../components/UI/RecordMenuItem'
import Loader from '../../components/UI/Loader'
import { getClientToken } from '../../http'
import { getServicePrice } from '../../utils/price'
import InfoIcon from '@mui/icons-material/Info';
import Search from '../../components/UI/Search'
import RecordMenuList from '../../components/UI/RecordMenuList'
import { getAvatarProps } from '../../utils/avatar'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { IService } from '../../models/IService'


const DiscountAlert = styled(Alert)`
    margin-top: 10px;
`

const ClientAuthLink = styled(Link)`
    color: inherit;
    text-decoration: none;
    font-weight: 700;

    &:hover {
        text-decoration: underline;
    }
`

export default function AppointmentServicePage() {

    const customerToken = getClientToken()

    const { selectedMaster, selectedDate, branch } = useAppSelector(state => state.client)
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [services, setServices] = useState<IService[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const masterId = selectedMaster._id || ''
        const date = selectedDate
        getServices(masterId, Date.parse(date.toString()), branch._id, customerToken || '').then(res => {
            if (res.services) {
                setServices(res.services)
            }
            setLoading(false)
        })
    }, [])

    const handleChoose = (service: IService) => {
        dispatch(updateClientData({ selectedService: service }))
        navigate(`/${branch._id}`)
    }

    const hasAlert = (branch.discount_settings.is_enabled || branch.birthday_discount_settings.is_enabled) && !customerToken

    return (
        <>
            {hasAlert &&
                <DiscountAlert severity="info" icon={<InfoIcon />}>
                    <AlertTitle>В этом филиале действует система скидок!</AlertTitle>
                    <ClientAuthLink to='../client/auth'>Авторизируйтесь</ClientAuthLink> чтобы оформить запись со скидкой.
                </DiscountAlert>
            }
            <Search
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
            {loading
                ? <Loader />
                : <RecordMenuList>
                    {services
                        .filter(service => searchQuery
                            ? service.title.toLowerCase().includes(searchQuery.toLowerCase())
                            : service)
                        .map(service =>
                            <RecordMenuItem
                                key={service._id}
                                onClick={() => handleChoose(service)}
                                avatarProps={{ ...getAvatarProps(service.avatar_url, service.title, 'service') }}
                                primaryText={service.title}
                                secondaryText={getServicePrice(service)}
                            />
                        )
                    }
                </RecordMenuList>
            }
        </>
    )
}