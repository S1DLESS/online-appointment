import { TextField } from '@mui/material'
import React, { ChangeEvent } from 'react'
import styled from 'styled-components'


const SearchInput = styled(TextField)`
    margin-top: 20px;

    & >div {
        background-color: #fff;
        border-radius: 8px;
    }
`

interface Props {
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function Search({ value, onChange }: Props) {
    return (
        <SearchInput
            placeholder='Поиск'
            type='search'
            value={value}
            onChange={onChange}
            fullWidth
        />
    )
}