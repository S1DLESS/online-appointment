import { Person } from '@mui/icons-material'
import { Avatar, Button, IconButton, Menu, MenuItem } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context'
import { deleteToken } from '../http'
import { deleteAllAdminData } from '../store/actions'
import styled from 'styled-components'
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch } from '../hooks/useAppDispatch'


const Header = styled.header`
    display: flex;
    justify-content: flex-end;
    position: fixed;
    right: 0;
    padding: 10px 30px;
    width: calc(100% - 250px);
    background-color: rgba(255, 255, 255, 0.75);
    backdrop-filter: blue(5px);
    z-index: 1;

    @media (max-width: 1200px) {
        width: 100%;
        justify-content: space-between;
    }
`

const AvatarButton = styled(Button)`
    padding: 0;
    min-width: 40px;
    border-radius: 50%;
    transition: transform .1s;

    &:hover {
        transform: scale(1.1);
    }
`

const MobileMenuButton = styled(IconButton)`
    display: none;

    @media (max-width: 1200px) {
        display: inherit;
    }
`

interface Props {
    onOpenMenu: () => void
}

export default function AdminHeader({ onOpenMenu }: Props) {

    const { setHasToken } = useContext(AuthContext)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const handleOpenUserMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorEl(null)
    }

    const goToSettingsPage = () => {
        handleCloseUserMenu()
        navigate('settings')
    }

    const logOut = () => {
        handleCloseUserMenu()
        dispatch(deleteAllAdminData())
        deleteToken()
        setHasToken(false)
    }

    return (
        <Header>
            <MobileMenuButton onClick={onOpenMenu}>
                <MenuIcon />
            </MobileMenuButton>
            <AvatarButton onClick={handleOpenUserMenu}>
                <Avatar children={<Person />} />
            </AvatarButton>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={goToSettingsPage}>Настройки</MenuItem>
                <MenuItem onClick={logOut}>Выйти</MenuItem>
            </Menu>
        </Header>
    )
}