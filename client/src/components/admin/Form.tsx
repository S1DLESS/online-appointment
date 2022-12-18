import { Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import FormCustomization from '../FormCustomization';
import FormAppointmentSettings from '../FormAppointmentSettings';


export default function Form() {

    const [tab, setTab] = useState(0)

    return (
        <>
            <Tabs
                value={tab}
                onChange={(e, newTab) => setTab(newTab)}
            >
                <Tab label="Настройки записи" />
                <Tab label="Кастомизация формы" />
            </Tabs>
            <div role='tabpanel' hidden={tab !== 0}>
                <FormAppointmentSettings />
            </div>
            <div role='tabpanel' hidden={tab !== 1}>
                <FormCustomization />
            </div>
        </>
    )
}