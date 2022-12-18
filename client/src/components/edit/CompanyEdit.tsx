import LoadingButton from '@mui/lab/LoadingButton'
import { TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { editCompany } from '../../http/userAPI'
import { updateAdminData } from '../../store/actions'
import styled from 'styled-components'
import { ICompany } from '../../models/ICompany'
import { useAppDispatch } from '../../hooks/useAppDispatch'


const Container = styled.div`
    display: flex;
    flex-direction: column;
`

const StyledTextField = styled(TextField)`
    margin-top: 10px;
    width: 300px;

    &:first-child {
        margin-top: 0;
    }
`

const StyledLoadingButton = styled(LoadingButton)`
    margin-top: 10px;
`

interface Props {
    data: ICompany
    onCloseModal: () => void
}

export default function CompanyEdit({ data, onCloseModal }: Props) {

    const dispatch = useAppDispatch()

    const [company, setCompany] = useState({
        id: data ? data._id : '',
        title: data ? data.title : '',
        description: data ? data.description : '',
    })
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        setErrorMessage('')
        setLoading(true)

        editCompany({
            title: company.title,
            description: company.description,
        }, company.id).then(res => {
            if (res.company) {
                dispatch(updateAdminData(res))
                onCloseModal()
            } else {
                setErrorMessage(res.message)
            }
        })
        setLoading(false)
    }

    return (
        <Container>
            <StyledTextField
                label='Название'
                value={company.title}
                onChange={e => setCompany({ ...company, title: e.target.value })}
            />
            <StyledTextField
                label='Описание'
                value={company.description}
                onChange={e => setCompany({ ...company, description: e.target.value })}
            />
            <StyledLoadingButton
                disabled={!company.title}
                loading={loading}
                variant='outlined'
                onClick={handleSubmit}
            >
                Редактировать
            </StyledLoadingButton>
            {errorMessage && <Typography>{errorMessage}</Typography>}
        </Container>
    )
}