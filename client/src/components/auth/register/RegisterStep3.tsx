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
    branchTitle: string
    setBranchTitle: (a: string) => void
    branchType: string
    setBranchType: (a: string) => void
    branchDescription: string
    setBranchDescription: (a: string) => void
    branchAddress: string
    setBranchAddress: (a: string) => void
    branchPhone: string
    setBranchPhone: (a: string) => void
    branchWorkingHours: string
    setBranchWorkingHours: (a: string) => void
    onChangeStep: (a: number) => void
    onRegister: () => void
}

export default function RegisterStep3({
    branchTitle,
    setBranchTitle,
    branchType,
    setBranchType,
    branchDescription,
    setBranchDescription,
    branchAddress,
    setBranchAddress,
    branchPhone,
    setBranchPhone,
    branchWorkingHours,
    setBranchWorkingHours,
    onChangeStep,
    onRegister
}: Props) {

    const [btnDisabled, setBtnDisabled] = useState(false)

    return (
        <Container>
            <Header>
                <IconButton onClick={() => onChangeStep(2)}><ArrowBackIcon /></IconButton>
                <Typography variant='h5'>Шаг 3 из 3: Филиал</Typography>
            </Header>
            <TextField
                required
                label="Название филиала"
                value={branchTitle}
                onChange={e => setBranchTitle(e.target.value)}
                fullWidth
                style={{ marginTop: '10px' }}
            />
            <TextField
                required
                label="Тип филиала"
                value={branchType}
                onChange={e => setBranchType(e.target.value)}
                fullWidth
                style={{ marginTop: '10px' }}
            />
            <TextField
                multiline
                rows={3}
                label="Описание филиала"
                value={branchDescription}
                onChange={e => setBranchDescription(e.target.value)}
                fullWidth
                style={{ marginTop: '10px' }}
            />
            <TextField
                label="Адрес филиала"
                value={branchAddress}
                onChange={e => setBranchAddress(e.target.value)}
                fullWidth
                style={{ marginTop: '10px' }}
            />
            <TextField
                label="Телефон филиала"
                value={branchPhone}
                onChange={e => setBranchPhone(e.target.value)}
                fullWidth
                style={{ marginTop: '10px' }}
            />
            {/* <TextField
                label="Рабочие часы филиала"
                value={branchWorkingHours}
                onChange={e => setBranchWorkingHours(e.target.value)}
                fullWidth
                style={{marginTop: '10px'}}
            /> */}
            <Button
                disabled={btnDisabled}
                onClick={() => onRegister()}
                variant='contained'
                fullWidth
                style={{ marginTop: '10px', marginBottom: '10px' }}
            >Зарегистрироваться</Button>
        </Container>
    )
}