import React, { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import { getClientToken } from '../http'
import ClientAuth from '../pages/client/ClientAuth'
import ClientProfile from '../pages/client/ClientProfile'


export default function ClientProfileRoutes() {

    const { branch } = useAppSelector(state => state.client)

    const [isAuth, setIsAuth] = useState(!!getClientToken())

    return (
        <Routes>
            {isAuth
                ? <>
                    <Route path='*' element={<Navigate to={`/${branch._id}/client/profile`} />} />
                    <Route path='/profile' element={<ClientProfile onLogout={() => setIsAuth(false)} />} />
                </>
                : <>
                    <Route path='*' element={<Navigate to={`/${branch._id}/client/auth`} />} />
                    <Route path='/auth' element={<ClientAuth onLogin={() => setIsAuth(true)} />} />
                </>
            }
        </Routes>
    )
}