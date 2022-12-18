import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Appointments from '../../components/admin/Appointments'
import Masters from '../../components/admin/Masters'
import Services from '../../components/admin/Services'
import Settings from '../../components/admin/Settings'
import { AdminContext } from '../../context'
import { getBranchData } from '../../http/userAPI'
import { updateAdminData } from '../../store/actions'
import Loader from '../../components/UI/Loader'
import styled from 'styled-components'
import Customers from '../../components/admin/Customers'
import Discounts from '../../components/admin/Discounts'
import Form from '../../components/admin/Form'
import Sidebar from '../../components/Sidebar'
import AdminHeader from '../../components/AdminHeader'
import AdminPageTitle from '../../components/AdminPageTitle'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'


const Dashboard = styled.div`
    display: flex;
    min-height: 100vh;
`

const Main = styled.main`
    width: calc(100% - 250px);
    padding: 60px 30px 0;

    @media (max-width: 1200px) {
        width: 100%;
        padding-left: 20px;
        padding-right: 20px;
    }

    @media (max-width: 600px) {
        padding-left: 10px;
        padding-right: 10px;
    }
`

export default function AdminDashboard() {

    const dispatch = useAppDispatch()
    const branches = useAppSelector(state => state.admin.branches)

    const [branchId, setBranchId] = useState(branches[0]._id)
    const [loading, setLoading] = useState(true)
    const [openMenu, setOpenMenu] = useState(false)

    useEffect(() => {
        setLoading(true)
        getBranchData(branchId).then(res => {
            dispatch(updateAdminData(res))
            setLoading(false)
        })
    }, [branchId])


    if (loading) {
        return <Loader />
    } else {
        return (
            <AdminContext.Provider value={{ branchId, setBranchId }}>
                <AdminHeader onOpenMenu={() => setOpenMenu(true)} />
                <Dashboard>
                    <Sidebar
                        branches={branches}
                        openMenu={openMenu}
                        onClickLink={() => setOpenMenu(false)}
                    />
                    <Main>
                        <AdminPageTitle />
                        <Routes>
                            <Route path='*' element={<Navigate to='/admin/dashboard/appointments' />} />
                            <Route path='/appointments' element={<Appointments />} />
                            <Route path='/customers' element={<Customers />} />
                            <Route path='/services' element={<Services />} />
                            <Route path='/masters' element={<Masters />} />
                            <Route path='/discounts' element={<Discounts />} />
                            <Route path='/form' element={<Form />} />
                            <Route path='/settings' element={<Settings />} />
                        </Routes>
                    </Main>
                </Dashboard>
            </AdminContext.Provider>
        )
    }
}