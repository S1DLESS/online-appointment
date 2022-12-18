import React from 'react'
import { Modal as MuiModal, Paper } from '@mui/material'
import styled from 'styled-components'


const StyledModal = styled(MuiModal)`
    display: flex;
    justify-content: center;
    align-items: center;
`

const Content = styled(Paper)`
    padding: 10px;
    max-width: 90vw;
    max-height: 90vh;
`

interface Props {
    open: boolean
    onClose: () => void
    component: React.ReactNode
}

export default function Modal({ open, onClose, component }: Props) {
    return (
        <StyledModal
            open={open}
            onClose={onClose}
        >
            <Content elevation={4}>
                {component}
            </Content>
        </StyledModal>
    )
}