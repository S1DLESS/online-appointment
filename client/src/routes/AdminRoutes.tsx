import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Loader from '../components/UI/Loader'
import { AuthContext } from '../context'
import { deleteToken, getToken, setToken } from '../http'
import { checkToken } from '../http/userAPI'
import { updateAdminData } from '../store/actions'
import AccountVerifiedPage from '../pages/admin/AccountVerifiedPage'
import AdminAuthPage from '../pages/admin/AdminAuthPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import { useAppDispatch } from '../hooks/useAppDispatch'


export default function AdminRoutes() {

    const [hasToken, setHasToken] = useState(!!getToken())
    const [loading, setLoading] = useState(true)

    const dispatch = useAppDispatch()

    const { pathname } = useLocation()

    const isNoVerifiedPage = `${pathname.match(/admin\/account-verified/)}` !== 'admin/account-verified'

    useEffect(() => {
        if (hasToken && isNoVerifiedPage) {
            checkToken().then(res => {
                if (res.token) {
                    setToken(res.token)
                    dispatch(updateAdminData(res.data))
                } else {
                    if (res.message === 'Не авторизован') {
                        deleteToken()
                        setHasToken(false)
                    }
                }
                setLoading(false)
            })
        } else {
            setLoading(false)
        }
    }, [hasToken])

    if (loading) {
        return <Loader />
    } else {
        return (
            <AuthContext.Provider value={{ setHasToken, setLoading }}>
                <Routes>
                    {hasToken
                        ? <>
                            <Route path='*' element={<Navigate to='/admin/dashboard' />} />
                            <Route path='/dashboard/*' element={<AdminDashboard />} />
                        </>
                        : <Route path='*' element={<AdminAuthPage />} />
                    }
                    <Route path='/account-verified' element={<AccountVerifiedPage />} />
                </Routes>
            </AuthContext.Provider>
        )
    }
}