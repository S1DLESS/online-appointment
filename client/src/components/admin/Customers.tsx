import { List, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'
import React from 'react'
import { useAppSelector } from '../../hooks/useAppSelector'


export default function Customers() {

    const { customers } = useAppSelector(state => state.admin)

    return (
        <Paper>
            <List>
                {customers.length
                    ? customers.map(customer =>
                        <ListItem
                            key={customer._id}
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemText primary={customer.name[0]} />
                            </ListItemButton>
                        </ListItem>)
                    : <Typography variant='h6' style={{ textAlign: 'center' }}>Клиентов пока нет</Typography>
                }
            </List>
        </Paper>
    )
}