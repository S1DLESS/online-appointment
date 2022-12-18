import { Button, Paper, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AdminContext } from '../../context'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { deleteBranch } from '../../http/branchAPI'
import { updateAdminData } from '../../store/actions'
import DeleteAccount from '../DeleteAccount'
import BranchEdit from '../edit/BranchEdit'
import CompanyEdit from '../edit/CompanyEdit'
import UserEdit from '../edit/UserEdit'
import Modal from '../UI/Modal'


const StyledPaper = styled(Paper)`
    padding: 10px;
    margin-bottom: 15px;
`

const Header = styled(Typography)`
    line-height: 1;
    margin-bottom: 10px;
`

const BranchButtons = styled.div`
    display: flex;
    flex-wrap: wrap;
    row-gap: 10px;
    column-gap: 10px;
`

export default function Settings() {

    const { branchId } = useContext(AdminContext)

    const state = useAppSelector(state => state.admin)
    const dispatch = useAppDispatch()

    const [modal, setModal] = useState({
        open: false,
        component: {} as React.ReactNode
    })

    const handleCloseModal = () => {
        setModal({ open: false, component: {} as React.ReactNode })
    }

    const handleOpenUserModal = () => {
        setModal({
            open: true,
            component: <UserEdit data={state.user} onCloseModal={handleCloseModal} />
        })
    }

    const handleOpenCompanyModal = () => {
        setModal({
            open: true,
            component: <CompanyEdit data={state.company} onCloseModal={handleCloseModal} />
        })
    }

    const branch = state.branches.find(el => el._id === branchId)
    const handleOpenBranchModal = (type: string) => {
        if (type === 'add') {
            setModal({
                open: true,
                component: <BranchEdit
                    type='add'
                    onCloseModal={handleCloseModal}
                    companyId={branch ? branch.company_id : ''}
                />
            })
        }
        if (type === 'edit') {
            setModal({
                open: true,
                component: <BranchEdit
                    type='edit'
                    data={branch}
                    onCloseModal={handleCloseModal}
                    companyId={branch ? branch.company_id : ''} />
            })
        }
    }

    const handleDeleteAccount = () => {
        setModal({
            open: true,
            component: <DeleteAccount />
        })
    }

    const handleDeleteBranch = () => {
        deleteBranch(branchId).then(res => {
            if (res.branches) {
                dispatch(updateAdminData(res))
                // setBranchId(state.branches)
            }
        })
    }

    return (
        <>
            <StyledPaper>
                <Header variant='h6'>Настройки пользователя</Header>
                <Button
                    variant='outlined'
                    onClick={handleOpenUserModal}
                >Редактировать пользователя</Button>
            </StyledPaper>
            <StyledPaper>
                <Header variant='h6'>Настройки компании</Header>
                <Button
                    variant='outlined'
                    onClick={handleOpenCompanyModal}
                >Редактировать компанию</Button>
            </StyledPaper>
            <StyledPaper>
                <Header variant='h6'>Настройки филиала</Header>
                <BranchButtons>
                    <Button
                        variant='outlined'
                        onClick={() => handleOpenBranchModal('edit')}
                    >Изменить</Button>
                    <Button
                        variant='outlined'
                        onClick={() => handleOpenBranchModal('add')}
                    >Создать филиал</Button>
                    <Button
                        variant='outlined'
                        color='error'
                        disabled={state.branches.length === 1}
                        onClick={handleDeleteBranch}
                    >Удалить филиал</Button>
                </BranchButtons>
            </StyledPaper>
            <Button
                variant='outlined'
                color='error'
                onClick={handleDeleteAccount}
            >Удалить аккаунт</Button>
            <Modal
                open={modal.open}
                onClose={handleCloseModal}
                component={modal.component}
            />
        </>
    )
}