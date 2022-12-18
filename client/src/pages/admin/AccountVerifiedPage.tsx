import { Typography } from '@mui/material'
import React from 'react'


export default function AccountVerifiedPage() {
    return (
        <div>
            <Typography
                variant='h3'
                style={{textAlign: 'center'}}
            >Ваша учетная запись подтверждена</Typography>
            <Typography
                color='textSecondary'
                style={{marginTop: '30px', textAlign: 'center'}}
            >Можете закрыть эту страницу</Typography>
        </div>
    )
}