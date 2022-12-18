import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMasters } from '../../http/masterAPI'
import { updateClientData } from '../../store/actions'
import { getAvatarProps } from '../../utils/avatar'
import RecordMenuItem from '../../components/UI/RecordMenuItem'
import Loader from '../../components/UI/Loader'
import Search from '../../components/UI/Search'
import RecordMenuList from '../../components/UI/RecordMenuList'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { IMaster } from '../../models/IMaster'


export default function AppointmentMasterPage() {

    const { selectedService, selectedDate, branch } = useAppSelector(state => state.client)
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [masters, setMasters] = useState<IMaster[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const serviceId = selectedService._id || ''
        const date = selectedDate
        getMasters(serviceId, Date.parse(date.toString()), branch._id).then(res => {
            if (res.masters) {
                setMasters(res.masters)
            }
            setLoading(false)
        })
    }, [])

    const handleChoose = (master: IMaster) => {
        dispatch(updateClientData({ selectedMaster: master }))
        navigate(`/${branch._id}?master=${master._id}`)
    }

    return (
        <>
            <Search
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
            {loading
                ? <Loader />
                : <RecordMenuList>
                    {masters
                        .filter(master => searchQuery
                            ? master.name.toLowerCase().includes(searchQuery.toLowerCase())
                            : master)
                        .map(master =>
                            <RecordMenuItem
                                key={master._id}
                                onClick={() => handleChoose(master)}
                                avatarProps={{ ...getAvatarProps(master.avatar_url, master.name, 'master') }}
                                primaryText={master.name}
                                secondaryText={master.position}
                            />
                        )
                    }
                </RecordMenuList>
            }
        </>
    )
}