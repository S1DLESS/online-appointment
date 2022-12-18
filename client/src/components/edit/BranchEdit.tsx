import LoadingButton from '@mui/lab/LoadingButton'
import { TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { createBranch, editBranch } from '../../http/branchAPI'
import { updateAdminData } from '../../store/actions'
import { getPhoneFromMaskField } from '../../utils/validation'
import styled from 'styled-components'
import { IBranch } from '../../models/IBranch'
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
    type: string
    data?: IBranch
    onCloseModal: () => void
    companyId: string
}

export default function BranchEdit({ type, data, onCloseModal, companyId }: Props) {

    const dispatch = useAppDispatch()

    const [branch, setBranch] = useState({
        id: data ? data._id : '',
        title: data ? data.title : '',
        type: data ? data.type : '',
        description: data ? data.description : '',
        address: data ? data.address : '',
        phone: data ? `${data.phone}` : '',
        // workingHours: data ? data.working_hours : '',
        companyId
    })
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        setErrorMessage('')
        setLoading(true)

        if (type === 'add') {
            createBranch({
                title: branch.title,
                type: branch.type,
                description: branch.description,
                address: branch.address,
                phone: getPhoneFromMaskField(branch.phone),
                // working_hours: branch.workingHours,
                company_id: branch.companyId
            }).then(res => {
                if (res.branches) {
                    dispatch(updateAdminData(res))
                    onCloseModal()
                } else {
                    setErrorMessage(res.message)
                }
            })
        }
        if (type === 'edit') {
            editBranch({
                title: branch.title,
                type: branch.type,
                description: branch.description,
                address: branch.address,
                phone: getPhoneFromMaskField(branch.phone),
                // working_hours: branch.workingHours
            }, branch.id).then(res => {
                if (res.branches) {
                    dispatch(updateAdminData(res))
                    onCloseModal()
                } else {
                    setErrorMessage(res.message)
                }
            })
        }
        setLoading(false)
    }

    return (
        <Container>
            <StyledTextField
                required
                label="Название"
                value={branch.title}
                onChange={e => setBranch({ ...branch, title: e.target.value })}
            />
            <StyledTextField
                required
                label="Тип"
                value={branch.type}
                onChange={e => setBranch({ ...branch, type: e.target.value })}
            />
            <StyledTextField
                multiline
                rows={3}
                label="Описание"
                value={branch.description}
                onChange={e => setBranch({ ...branch, description: e.target.value })}
            />
            <StyledTextField
                label="Адрес"
                value={branch.address}
                onChange={e => setBranch({ ...branch, address: e.target.value })}
            />
            <InputMask
                mask='+375 (99) 999-99-99'
                value={branch.phone}
                onChange={e => setBranch({ ...branch, phone: e.target.value })}
            >
                <StyledTextField
                    label="Телефон"
                />
            </InputMask>
            {/* <StyledTextField
                label="Рабочие часы филиала"
                value={branch.workingHours}
                onChange={e => setBranch({...branch, workingHours: e.target.value})}
            /> */}
            <StyledLoadingButton
                disabled={!branch.title || !branch.type}
                loading={loading}
                variant='outlined'
                onClick={handleSubmit}
            >
                {type === 'add' ? 'Создать' : 'Редактировать'}
            </StyledLoadingButton>
            {errorMessage && <Typography>{errorMessage}</Typography>}
        </Container>
    )
}