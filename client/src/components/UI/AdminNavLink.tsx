import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { theme } from '../../styles/theme'


const StyledNavLink = styled(NavLink)`
    text-decoration: none;
    width: 100%;
`

const LiButton = styled(ListItemButton)`
    color: ${props => props.selected ? theme.palette.primary.main : theme.palette.text.secondary};
    border-radius: 8px;

    & .MuiListItemIcon-root {
        min-width: 40px;
        ${props => props.selected ? `color: ${theme.palette.primary.main};` : ''}
    }

    ${props => props.selected
        ? `& .MuiTypography-root {
            font-weight: 600;
            color: ${theme.palette.primary.main}
        }`
        : ''
    }
`

interface Props {
    to: string
    text: string
    icon: React.ReactNode
    onClickLink: () => void
}

export default function AdminNavLink({ to, text, icon, onClickLink }: Props) {
    return (
        <StyledNavLink to={to} onClick={onClickLink}>
            {({ isActive }) =>
                <LiButton selected={isActive}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText
                        primary={text}
                        primaryTypographyProps={{ variant: 'body2' }}
                    />
                </LiButton>
            }
        </StyledNavLink>
    )
}