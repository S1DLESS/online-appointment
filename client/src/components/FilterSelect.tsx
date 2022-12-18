import { FormControl, InputLabel, Select } from '@mui/material'
import React from 'react'
import styled from 'styled-components'


const StyledFormControl = styled(FormControl)`
    width: 190px;

    & .MuiSelect-select {
        padding-top: 12px;
        padding-bottom: 12px;
    }
`

interface Props {
    label: string
    value: string
    onChange: (a: string) => void
    children: React.ReactNode
}

export default function FilterSelect({ label, value, onChange, children }: Props) {
    return (
        <StyledFormControl>
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                value={value}
                label={label}
                onChange={e => onChange(e.target.value)}
            >
                {children}
            </Select>
        </StyledFormControl>
    )
}