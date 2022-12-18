import { Button, IconButton, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useState } from 'react'
import styled from 'styled-components'


const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
`

const Header = styled.div`
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

interface Props {
    companyTitle: string
    setCompanyTitle: (a: string) => void
    companyDescription: string
    setCompanyDescription: (a: string) => void
    onChangeStep: (a: number) => void
}

export default function RegisterStep2({ companyTitle, setCompanyTitle, companyDescription, setCompanyDescription, onChangeStep }: Props) {

    const [btnDisabled, setBtnDisabled] = useState(false)

    return (
        <Container>
            <Header>
                <IconButton onClick={() => onChangeStep(1)}><ArrowBackIcon /></IconButton>
                <Typography variant='h5'>Шаг 2 из 3: Компания</Typography>
            </Header>
            <TextField
                required
                label="Название компании"
                value={companyTitle}
                onChange={e => setCompanyTitle(e.target.value)}
                fullWidth
                style={{ marginTop: '10px' }}
            />
            <TextField
                multiline
                rows={3}
                label="Описание компании"
                value={companyDescription}
                onChange={e => setCompanyDescription(e.target.value)}
                fullWidth
                style={{ marginTop: '10px' }}
            />
            <Button
                disabled={btnDisabled}
                onClick={() => onChangeStep(3)}
                variant='contained'
                fullWidth
                style={{ marginTop: '10px', marginBottom: '10px' }}
            >Далее</Button>
        </Container>
    )
}