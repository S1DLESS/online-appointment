import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Container as MuiContainer, ThemeProvider } from '@mui/material'
import styled from 'styled-components'
import { updateClientData, updateCustomerData } from '../store/actions'
import AppointmentMainPage from '../pages/appointment/AppointmentMainPage'
import AppointmentMasterPage from '../pages/appointment/AppointmentMasterPage'
import AppointmentServicePage from '../pages/appointment/AppointmentServicePage'
import AppointmentDateTimePage from '../pages/appointment/AppointmentDateTimePage'
import AppointmentRecordPage from '../pages/appointment/AppointmentRecordPage'
import NotFoundPage from '../pages/NotFoundPage'
import { deleteClientToken, getClientToken } from '../http'
import { getBranch } from '../http/branchAPI'
import { getCustomerData } from '../http/customerAPI'
import ClientProfileRoutes from './ClientProfileRoutes'
import { formTheme } from '../styles/theme'
import Header from '../components/Header'
import Loader from '../components/UI/Loader'
import AboutBranchPage from '../pages/AboutBranchPage'
import { Theme } from "@mui/material/styles/createTheme";
import { useAppDispatch } from '../hooks/useAppDispatch'


interface Bg {
    type: string
    src: string
}

const Background = styled.div<Bg>`
    ${props => props.type === 'image'
        ? `background: url('${process.env.REACT_APP_API_URL}/formBackgrounds/${props.src}') center center/cover no-repeat #f4f6f8;`
        : `background-color: ${props.src};`
    }
`

const Container = styled(MuiContainer)`
    min-height: 100vh;
    backdrop-filter: blur(10px);
`

export default function ClientRoutes() {

    const [loading, setLoading] = useState(true)
    const [isBranch, setIsBranch] = useState(false)
    const [customization, setCustomization] = useState({
        mainColor: '#00AB55',
        background: {
            type: 'color',
            src: '#f4f6f8'
        }
    })

    const dispatch = useAppDispatch()

    const { branchId } = useParams()

    const getData = async () => {
        const clientToken = getClientToken()
        if (clientToken) {
            const clientData = await getCustomerData(clientToken, branchId || '')
            if (clientData.customer) {
                dispatch(updateCustomerData({
                    ...clientData.customer,
                    records: clientData.records
                }))
            } else {
                deleteClientToken()
            }
        }
        const branchData = await getBranch(branchId || '')
        if (branchData.branch) {
            dispatch(updateClientData(branchData))
            setIsBranch(true)
            setCustomization({
                mainColor: branchData.branch.form_settings.main_color,
                background: {
                    type: branchData.branch.form_settings.background.type,
                    src: branchData.branch.form_settings.background.src
                }
            })
        }
    }

    useEffect(() => {
        getData().then(() => setLoading(false))
    }, [branchId])

    const theme = (outerTheme: Theme) => formTheme(outerTheme, customization.mainColor)

    if (loading) {
        return (
            <Loader />
        )
    } else {
        if (isBranch) {
            return (
                <ThemeProvider theme={theme}>
                    <Background
                        type={customization.background.type}
                        src={customization.background.src}
                    >
                        <Container maxWidth='sm' disableGutters>
                            <Header />
                            <Routes>
                                <Route path='*' element={<Navigate to={`/${branchId}`} />} />
                                <Route path='/' element={<AppointmentMainPage />} />
                                <Route path='/master' element={<AppointmentMasterPage />} />
                                <Route path='/service' element={<AppointmentServicePage />} />
                                <Route path='/time' element={<AppointmentDateTimePage />} />
                                <Route path='/record' element={<AppointmentRecordPage />} />
                                <Route path='/client/*' element={<ClientProfileRoutes />} />
                                <Route path='/about' element={<AboutBranchPage />} />
                            </Routes>
                        </Container>
                    </Background>
                </ThemeProvider>
            )
        } else {
            return (
                <NotFoundPage />
            )
        }
    }
}