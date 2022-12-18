import { Avatar, FormControl, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Paper, Select, Typography } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'
import DeleteIcon from '@mui/icons-material/Delete'
import React, { useContext, useState } from 'react'
import AddButton from '../AddButton'
import Modal from '../UI/Modal'
import AppointmentEdit from '../edit/AppointmentEdit'
import { deleteRecord } from '../../http/recordAPI'
import { AdminContext } from '../../context'
import { updateAdminData } from '../../store/actions'
import styled from 'styled-components'
import FilterDateButton from '../FilterDateButton'
import FilterSelect from '../FilterSelect'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { IRecord } from '../../models/IRecord'


const Controls = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    column-gap: 10px;
    row-gap: 10px;
`

const Filters = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: 10px;
    row-gap: 10px;
`

const StyledPaper = styled(Paper)`
    margin-top: 10px;
`

export default function Appointments() {

    const { branchId } = useContext(AdminContext)

    const state = useAppSelector(state => state.admin)
    const dispatch = useAppDispatch()

    const [date, setDate] = useState(new Date())
    const [master, setMaster] = useState('all')
    const [service, setService] = useState('all')
    const [modal, setModal] = useState({
        open: false,
        data: {} as IRecord
    })

    const handleOpenModal = (data: IRecord) => setModal({ open: true, data })
    const handleCloseModal = () => setModal({ open: false, data: {} as IRecord })

    const handleDelete = (id: string) => {
        deleteRecord(id, branchId).then(res => {
            if (res.records) {
                dispatch(updateAdminData(res))
            }
        })
    }

    const filteredRecords = state.records
        .filter(record => (date.setHours(0, 0, 0, 0) <= Date.parse(record.date.toString())) && (Date.parse(record.date.toString()) <= date.setHours(23, 59, 59, 999)))
        .filter(record => master === 'all' ? record : record.master_id === master)
        .filter(record => service === 'all' ? record : record.service_id === service)


    return (
        <>
            <Controls>
                <Filters>
                    <FilterDateButton
                        date={date}
                        setDate={setDate}
                    />
                    <FilterSelect
                        label="Специалист"
                        value={master}
                        onChange={setMaster}
                    >
                        <MenuItem value='all'>Все специалисты</MenuItem>
                        {state.masters.map(master =>
                            <MenuItem
                                key={master._id}
                                value={master._id}
                            >{master.name}</MenuItem>
                        )}
                    </FilterSelect>
                    <FilterSelect
                        label="Услуга"
                        value={service}
                        onChange={setService}
                    >
                        <MenuItem value='all'>Все услуги</MenuItem>
                        {state.services.map(service =>
                            <MenuItem
                                key={service._id}
                                value={service._id}
                            >{service.title}</MenuItem>
                        )}
                    </FilterSelect>
                </Filters>
                <AddButton type='Appointment' />
            </Controls>
            <StyledPaper>
                <List>
                    {filteredRecords.length
                        ? filteredRecords.map(record =>
                            <ListItem key={record._id} disablePadding secondaryAction={
                                <IconButton onClick={() => handleDelete(record._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemButton onClick={() => handleOpenModal(record)}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ImageIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={record.service_id} secondary={record.master_id} />
                                </ListItemButton>
                            </ListItem>
                        )
                        : <Typography variant='h6' style={{ textAlign: 'center' }}>Записей нет</Typography>
                    }
                </List>
            </StyledPaper>
            <Modal
                open={modal.open}
                onClose={handleCloseModal}
                component={<AppointmentEdit type='edit' data={modal.data} onCloseModal={handleCloseModal} />}
            />
        </>
    )
}