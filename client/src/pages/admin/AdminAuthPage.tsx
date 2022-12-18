import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import { Container as MuiContainer } from '@mui/material'
import Login from '../../components/auth/Login'
import Register from '../../components/auth/Register'
import ResetPassword from '../../components/auth/ResetPassword'
import NewPassword from '../../components/auth/NewPassword'


const Container = styled(MuiContainer)`
    padding-top: 50px;
    height: 100vh;
    max-width: 500px;
`

export default function AdminAuthPage() {
    return (
        <Container>
            <Routes>
                <Route path='*' element={<Navigate to='/admin/login' />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/new-password/:token' element={<NewPassword />} />
            </Routes>
        </Container>
    )
}