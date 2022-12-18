import { List as MuiList, MenuItem, Select } from '@mui/material'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { CalendarMonth, Contacts, Groups, List, Percent, ConfirmationNumber, Settings } from '@mui/icons-material'
import { AdminContext } from '../context'
import { Scrollbars } from 'react-custom-scrollbars'
import AdminNavLink from './UI/AdminNavLink'
import { IBranch } from '../models/IBranch'
import { SelectChangeEvent } from '@mui/material/Select'


interface NavContainerProps {
    open: boolean
}

const NavContainer = styled.nav<NavContainerProps>`
    width: 250px;
    height: 100vh;
    border-right: 1px dashed rgba(145, 158, 171, 0.25);
    background-color: #fff;
    transition: margin .2s;
    z-index: 2;

    @media (max-width: 1200px) {
        position: absolute;
        margin-left: ${props => props.open ? '0' : '-250px'};
    }
`

const FixedContainer = styled.div`
    position: fixed;
    width: 250px;
    height: 100%;
`

const BranchSelect = styled(Select)`
    background-color: rgba(145, 158, 171, 0.12);
    border-radius: 12px;
`

const Container = styled.div`
    padding: 10px 10px 0;
`

const StyledMuiList = styled(MuiList<'nav'>)`
    padding-top: 15px;

    & .MuiListItemButton-root {
        margin-top: 5px;
    }
`

interface Props {
    branches: IBranch[]
    openMenu: boolean
    onClickLink: () => void
}

export default function Sidebar({ branches, openMenu, onClickLink }: Props) {

    const { branchId, setBranchId } = useContext(AdminContext)

    return (
        <NavContainer open={openMenu}>
            <FixedContainer>
                <Scrollbars autoHide autoHideDuration={200}>
                    <Container>
                        <BranchSelect
                            value={branchId}
                            onChange={e => setBranchId(e.target.value as string)}
                            fullWidth
                        >
                            {branches.map(el =>
                                <MenuItem key={el._id} value={el._id}>{el.title}</MenuItem>
                            )}
                        </BranchSelect>
                        <StyledMuiList component='nav'>
                            <AdminNavLink
                                to='appointments'
                                text='Записи'
                                icon={<CalendarMonth />}
                                onClickLink={onClickLink}
                            />
                            <AdminNavLink
                                to='customers'
                                text='Клиенты'
                                icon={<Contacts />}
                                onClickLink={onClickLink}
                            />
                            <AdminNavLink
                                to='masters'
                                text='Специалисты'
                                icon={<Groups />}
                                onClickLink={onClickLink}
                            />
                            <AdminNavLink
                                to='services'
                                text='Услуги'
                                icon={<List />}
                                onClickLink={onClickLink}
                            />
                            <AdminNavLink
                                to='discounts'
                                text='Скидки'
                                icon={<Percent />}
                                onClickLink={onClickLink}
                            />
                            <AdminNavLink
                                to='form'
                                text='Онлайн-запись'
                                icon={<ConfirmationNumber />}
                                onClickLink={onClickLink}
                            />
                            <AdminNavLink
                                to='settings'
                                text='Настройки'
                                icon={<Settings />}
                                onClickLink={onClickLink}
                            />
                        </StyledMuiList>
                    </Container>
                </Scrollbars>
            </FixedContainer>
        </NavContainer>
    )
}