import { Avatar, IconButton, Paper, Typography, useTheme } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'
import styled from 'styled-components'


interface ContainerProps {
    maincolor: string
}

const Container = styled(Paper) <ContainerProps>`
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
    border: 2px solid transparent;
    transition: border .1s;

    &:hover {
        border-color: ${props => props.maincolor};
    }
`

const Main = styled.div`
    padding: 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    text-decoration: none;
`

const Text = styled.div`
    margin-left: 0.75rem;
    display: flex;
    flex-direction: column;
`

const DeleteButton = styled(IconButton)`
    align-self: center;
    margin-right: 10px;
`

interface Props {
    onClick: () => void
    avatarProps: {}
    primaryText: string
    secondaryText?: string
    hasDeleteButton?: boolean
    onDelete?: () => void
}

export default function RecordMenuItem({ onClick, avatarProps, primaryText, secondaryText = '', hasDeleteButton = false, onDelete = () => { } }: Props) {

    const theme = useTheme()

    return (
        <Container onClick={onClick} maincolor={theme.palette.primary.main}>
            <Main>
                <Avatar {...avatarProps} />
                <Text>
                    <Typography variant='subtitle1'>{primaryText}</Typography>
                    {secondaryText && <Typography color='textSecondary' variant='body2'>{secondaryText}</Typography>}
                </Text>
            </Main>
            {hasDeleteButton &&
                <DeleteButton onClick={e => {
                    e.stopPropagation()
                    onDelete()
                }}>
                    <DeleteIcon />
                </DeleteButton>
            }
        </Container>
    )
}