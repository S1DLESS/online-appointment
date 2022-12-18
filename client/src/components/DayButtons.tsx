import { Button, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components'
import { getWeekDay, getMonthName } from '../utils/date'
import { Scrollbars } from 'react-custom-scrollbars'


const Container = styled.div`
    width: calc(100% - 58px);
    margin-left: 10px;
`

const Months = styled.div`
    position: relative;
`

const Days = styled(ToggleButtonGroup)`
    display: flex;
`

interface DayButtonProps {
    primarytextcolor: string
    disabled: boolean
}

// ${props => props.variant === 'contained'
//         ? `
//             color: #fff;
//         `
//         : `
//             color: ${props.primarytextcolor};
//             border: 1px solid rgba(145, 158, 171, 0.32);
//         `
//     }

const DayButton = styled(ToggleButton) <DayButtonProps>`
    flex-direction: column;
    border-radius: 8px;
    height: 60px;
    
    
    ${props => props.disabled ? `
        & >span {
            opacity: 0.5;
        }
    ` : ''}
`

const LeftButton = styled(Button)`
    position: absolute;
    top: 0;
    left: 0;
`

const RightButton = styled(Button)`
    position: absolute;
    top: 0;
    right: 0;
`

const MidButton = styled(Button)`
    display: block;
    margin: 0 auto;
`

interface Props {
    value: Date
    onChange: (a: Date) => void
    maxDate: Date
    shouldDisableDate: (a: Date) => boolean
}

export default function DayButtons({ value, onChange, maxDate, shouldDisableDate }: Props) {

    const [month, setMonth] = useState(new Date().getMonth())
    const [year, setYear] = useState(new Date().getFullYear())

    const theme = useTheme()

    const date = new Date(year, month)
    const days = []

    for (let i = 0; i <= 30; i++) {
        const timestamp = Date.parse(date.toString()) + (24 * 60 * 60 * 1000) * i
        if (new Date(timestamp).getMonth() !== month) {
            break;
        }
        days.push({
            timestamp,
            weekDay: getWeekDay(new Date(timestamp).getDay(), true),
            day: new Date(timestamp).getDate(),
            isAvailable: !shouldDisableDate(new Date(timestamp)) && timestamp <= Date.parse(maxDate.toString())
        })
    }

    const prevMonth = month - 1 === -1 ? 11 : month - 1
    const nextMonth = month + 1 === 12 ? 0 : month + 1

    const changeMonth = (type: string) => {
        if (type === 'prev') {
            if (month === 0) {
                setYear(year - 1)
                setMonth(11)
            } else {
                setMonth(month - 1)
            }
        }
        if (type === 'next') {
            if (month === 11) {
                setYear(year + 1)
                setMonth(0)
            } else {
                setMonth(month + 1)
            }
        }
    }

    const hasLeftButton =
        (month > new Date().getMonth() && year === new Date().getFullYear())
        || (month < new Date().getMonth() && year > new Date().getFullYear())

    const hasRightButton =
        (month < maxDate.getMonth() && year === maxDate.getFullYear())
        || (month > maxDate.getMonth() && year < maxDate.getFullYear())

    return (
        <Container>
            <Months>
                {hasLeftButton &&
                    <LeftButton onClick={() => changeMonth('prev')}>{getMonthName(prevMonth, true)}</LeftButton>
                }
                <MidButton>{getMonthName(month, true)}</MidButton>
                {hasRightButton &&
                    <RightButton onClick={() => changeMonth('next')}>{getMonthName(nextMonth, true)}</RightButton>
                }
            </Months>
            <Scrollbars style={{ height: '70px' }}>
                <Days
                    exclusive
                    value={Date.parse(value.toString())}
                    onChange={(event, newDay) => onChange(new Date(newDay))}
                >
                    {days
                        .filter(day => day.timestamp >= new Date().setHours(0, 0, 0, 0))
                        .map(day =>
                            <DayButton
                                key={day.timestamp}
                                value={day.timestamp}
                                disabled={!day.isAvailable}
                                primarytextcolor={theme.palette.text.primary}
                            >
                                <Typography variant='button' style={{ fontSize: '12px' }}>{day.weekDay}</Typography>
                                <Typography variant='button' style={{ fontSize: '16px' }}>{day.day}</Typography>
                            </DayButton>
                        )}
                </Days>
            </Scrollbars>
        </Container>
    )
}