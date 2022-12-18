import { Typography } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../hooks/useAppSelector'


const Container = styled.div`
    background-color: #fff;
    min-height: 100vh;
    margin-top: 20px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding: 10px;
`

export default function AboutBranchPage() {

    const branch = useAppSelector(state => state.client.branch)

    return (
        <Container>
            <div style={{ textAlign: 'center' }}>
                <Typography variant='h3'>{branch.title}</Typography>
                <Typography variant='h5'>{branch.type}</Typography>
            </div>
            <Typography variant='h6' style={{ marginTop: '20px' }}>Описание:</Typography>
            <Typography>{branch.description}</Typography>
            <Typography variant='h6' style={{ marginTop: '20px' }}>Адрес:</Typography>
            <Typography>{branch.address}</Typography>
            <Typography variant='h6' style={{ marginTop: '20px' }}>Телефон:</Typography>
            <Typography>+375{branch.phone}</Typography>
        </Container>
    )
}