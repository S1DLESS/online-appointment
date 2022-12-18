import { Button, Menu, TextField } from '@mui/material'
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import React, { useState } from 'react'
import { getMonthName } from '../utils/date'


interface Props {
    date: Date
    setDate: (a: Date) => void
}

export default function FilterDateButton({ date, setDate }: Props) {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const day = date.getDate()
    const month = getMonthName(date.getMonth())
    const year = date.getFullYear()

    return (
        <>
            <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)}
                variant='outlined'
            >{day} {month} {year}</Button>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
            >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        value={date}
                        onChange={(newDate: { _d: Date } | null) => {
                            setDate(newDate ? newDate._d : new Date(0))
                            setAnchorEl(null)
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Menu>
        </>
    )
}