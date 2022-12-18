import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import React, { useContext, useState } from 'react'
import Modal from '../UI/Modal'
import { AdminContext } from '../../context'
import { deleteService } from '../../http/serviceAPI'
import { updateAdminData } from '../../store/actions'
import AddButton from '../AddButton'
import ServiceEdit from '../edit/ServiceEdit'
import styled from 'styled-components'
import { getAvatarProps } from '../../utils/avatar'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { IService } from '../../models/IService'


const Controls = styled.div`
    display: flex;
    justify-content: flex-end;
`

const StyledPaper = styled(Paper)`
    margin-top: 10px;
`

export default function Services() {

    const { branchId } = useContext(AdminContext)

    const services = useAppSelector(state => state.admin.services)
    const dispatch = useAppDispatch()

    const [modal, setModal] = useState({
        open: false,
        data: {} as IService
    })

    const handleOpenModal = (data: IService) => setModal({ open: true, data })
    const handleCloseModal = () => setModal({ open: false, data: {} as IService })

    const handleDelete = (id: string) => {
        deleteService(id, branchId).then(res => {
            if (res.services) {
                dispatch(updateAdminData(res))
            }
        })
    }

    return (
        <>
            <Controls>
                <AddButton type='Service' />
                <Modal
                    open={modal.open}
                    onClose={handleCloseModal}
                    component={<ServiceEdit type='edit' data={modal.data} onCloseModal={handleCloseModal} />}
                />
            </Controls>
            <StyledPaper>
                <List>
                    {services.map(el =>
                        <ListItem
                            key={el._id}
                            secondaryAction={
                                <IconButton onClick={() => handleDelete(el._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton onClick={() => handleOpenModal(el)}>
                                <ListItemAvatar>
                                    <Avatar {...getAvatarProps(el.avatar_url, el.title, 'service')} />
                                </ListItemAvatar>
                                <ListItemText primary={el.title} />
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
            </StyledPaper>
        </>
    )
}