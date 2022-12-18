import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getTime } from '../http/clientAPI'
import Loader from './UI/Loader'
import styled from 'styled-components'


const Times = styled(ToggleButtonGroup)`
    margin-top: 20px;
    padding-bottom: 60px;
    flex-wrap: wrap;

    .MuiToggleButtonGroup-grouped {
        margin: 4px;
        width: calc((100% / 4) - 8px);
        border-width: 1px;
        border-style: solid;
        border-radius: 8px;

        @media (max-width: 500px) {
            width: calc((100% / 3) - 8px);
        }

        &:not(:first-of-type) {
            margin: 4px;
            border-radius: 8px;
            border-left-color: rgba(0,0,0,0.12);
        }

        &:not(:last-of-type) {
            border-radius: 8px;
        }
    }
`

interface Props {
    date: string
    time: string
    onChange: (a: string) => void
    masterId: string
    serviceId: string
    branchId: string
}

export default function TimePicker({ date, time, onChange, masterId, serviceId, branchId }: Props) {

    const [loading, setLoading] = useState(true)
    const [timeArr, setTimeArr] = useState([])

    useEffect(() => {
        setLoading(true)
        getTime(Date.parse(date.toString()), branchId, masterId, serviceId).then(res => {
            if (res.timeArr) {
                setTimeArr(res.timeArr)
            }
            setLoading(false)
        })
    }, [branchId, date, masterId, serviceId])

    if (loading) {
        return <Loader />
    } else {
        return (
            <Times
                exclusive
                value={time}
                onChange={(event, newTime) => onChange(newTime)}
            >
                {timeArr.map(time =>
                    <ToggleButton
                        key={time}
                        value={time}
                    >{time}</ToggleButton>
                )}
            </Times>
        )
    }
}
