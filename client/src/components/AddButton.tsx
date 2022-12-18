import { Button } from '@mui/material'
import React, { useState } from 'react'
import AppointmentEdit from './edit/AppointmentEdit'
import MasterEdit from './edit/MasterEdit'
import ServiceEdit from './edit/ServiceEdit'
import Modal from './UI/Modal'


interface Props {
    type: string
}

export default function AddButton({ type }: Props) {

    const [openModal, setOpenModal] = useState(false)

    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)

    const buttonText = type === 'Master'
        ? `специалиста`
        : type === 'Service'
            ? 'услугу'
            : type === 'Appointment'
                ? 'запись'
                : ''

    const component = type === 'Master'
        ? <MasterEdit type='add' onCloseModal={handleCloseModal} />
        : type === 'Service'
            ? <ServiceEdit type='add' onCloseModal={handleCloseModal} />
            : type === 'Appointment'
                ? <AppointmentEdit type='add' onCloseModal={handleCloseModal} />
                : null

    return (
        <>
            <Button onClick={handleOpenModal} variant='contained'>Добавить {buttonText}</Button>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                component={component}
            />
        </>
    )
}