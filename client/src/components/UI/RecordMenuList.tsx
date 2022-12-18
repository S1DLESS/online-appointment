import React from 'react'
import styled from 'styled-components'


const List = styled.div`
    margin-top: 20px;

    & >div {
        margin-top: 10px;

        &:first-child {
        margin-top: 0;
        }
    }
`

interface Props {
    children: React.ReactNode
}

export default function RecordMenuList({ children }: Props) {
    return (
        <List>{children}</List>
    )
}