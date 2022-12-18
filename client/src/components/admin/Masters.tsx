import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import React, { useContext, useState } from 'react'
import Modal from '../UI/Modal'
import MasterEdit from '../edit/MasterEdit'
import { deleteMaster } from '../../http/masterAPI'
import { AdminContext } from '../../context'
import { updateAdminData } from '../../store/actions'
import AddButton from '../AddButton'
import { getAvatarProps } from '../../utils/avatar'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { IMaster } from '../../models/IMaster'


const Controls = styled.div`
    display: flex;
    justify-content: flex-end;
`

const StyledPaper = styled(Paper)`
    margin-top: 10px;
`

export default function Masters() {

    const { branchId } = useContext(AdminContext)

    const masters = useAppSelector(state => state.admin.masters)
    const dispatch = useAppDispatch()

    const [modal, setModal] = useState({
        open: false,
        data: {} as IMaster
    })

    const handleOpenModal = (data: IMaster) => setModal({ open: true, data })
    const handleCloseModal = () => setModal({ open: false, data: {} as IMaster })

    const handleDelete = (id: string) => {
        deleteMaster(id, branchId).then(res => {
            if (res.masters) {
                dispatch(updateAdminData(res))
            }
        })
    }

    return (
        <>
            <Controls>
                <AddButton type='Master' />
                <Modal
                    open={modal.open}
                    onClose={handleCloseModal}
                    component={<MasterEdit type='edit' data={modal.data} onCloseModal={handleCloseModal} />}
                />
            </Controls>
            <StyledPaper>
                <List>
                    {masters.map(el =>
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
                                    <Avatar {...getAvatarProps(el.avatar_url, el.name, 'master')} />
                                </ListItemAvatar>
                                <ListItemText primary={el.name} />
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
            </StyledPaper>
        </>
    )
}