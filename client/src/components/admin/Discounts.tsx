import LoadingButton from '@mui/lab/LoadingButton'
import { Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { AdminContext } from '../../context'
import { editDiscountBranch } from '../../http/branchAPI'
import { updateAdminData } from '../../store/actions'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { IBranch } from '../../models/IBranch'
import { SelectChangeEvent } from '@mui/material/Select'


const StyledPaper = styled(Paper)`
    padding: 10px;
    margin-bottom: 15px;
`

const StyledCheckbox = styled(Checkbox)`
    padding: 0 10px;
`

export default function Discounts() {

    const { branchId } = useContext(AdminContext)

    const state = useAppSelector(state => state.admin)
    const dispatch = useAppDispatch()
    const { discount_settings, birthday_discount_settings } = state.branches.find(branch => branch._id === branchId) as IBranch

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [isEnabledDiscount, setIsEnabledDiscount] = useState(discount_settings.is_enabled)
    const [discountVisits, setDiscountVisits] = useState(discount_settings.visits)
    const [discountTimeInDays, setDiscountTimeInDays] = useState(discount_settings.time_in_days)
    const [discountPercent, setDiscountPercent] = useState(discount_settings.percent)
    const [discountServices, setDiscountServices] = useState(discount_settings.services)

    const [isEnabledBirthdayDiscount, setIsEnabledBirthdayDiscount] = useState(birthday_discount_settings.is_enabled)
    const [daysBefore, setDaysBefore] = useState(birthday_discount_settings.days_before)
    const [daysAfter, setDaysAfter] = useState(birthday_discount_settings.days_after)
    const [birthdayDiscountPercent, setBirthdayDiscountPercent] = useState(birthday_discount_settings.percent)
    const [birthdayDiscountServices, setBirthdayDiscountServices] = useState(birthday_discount_settings.services)

    const renderSelectValue = (selected: string[]) => {
        const servicesTitles = selected.map(serviceId => {
            const service = state.services.find(el => el._id === serviceId)
            return service ? service.title : ''
        })
        return servicesTitles.join(', ')
    }

    const handleChangeService = (event: SelectChangeEvent<string[]>, type: string) => {
        const { target: { value } } = event
        if (type === 'discount') {
            setDiscountServices(typeof value === 'string' ? value.split(',') : value)
        }
        if (type === 'birthdayDiscount') {
            setBirthdayDiscountServices(typeof value === 'string' ? value.split(',') : value)
        }
    }

    const handleSubmit = () => {
        setLoading(true)
        editDiscountBranch({
            discount_settings: {
                is_enabled: isEnabledDiscount,
                visits: discountVisits,
                time_in_days: discountTimeInDays,
                percent: discountPercent,
                services: discountServices
            },
            birthday_discount_settings: {
                is_enabled: isEnabledBirthdayDiscount,
                days_before: daysBefore,
                days_after: daysAfter,
                percent: birthdayDiscountPercent,
                services: birthdayDiscountServices
            }
        }, branchId).then(res => {
            if (res.branches) {
                dispatch(updateAdminData(res))
            } else {
                setErrorMessage(res.message)
            }
            setLoading(false)
        })
    }

    return (
        <>
            <StyledPaper>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <StyledCheckbox
                                checked={isEnabledDiscount}
                                onChange={e => setIsEnabledDiscount(e.target.checked)}
                            />
                        }
                        label="Включена система скидок"
                    />
                </FormGroup>
                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', columnGap: '10px', rowGap: '10px' }}>
                    <TextField
                        disabled={!isEnabledDiscount}
                        type='number'
                        value={discountVisits}
                        onChange={e => setDiscountVisits(+e.target.value)}
                        label="Количество посещений"
                        style={{ width: '170px' }}
                    />
                    <TextField
                        disabled={!isEnabledDiscount}
                        type='number'
                        value={discountTimeInDays}
                        onChange={e => setDiscountTimeInDays(+e.target.value)}
                        label="За сколько дней"
                        style={{ width: '170px' }}
                    />
                    <TextField
                        disabled={!isEnabledDiscount}
                        type='number'
                        value={discountPercent}
                        onChange={e => setDiscountPercent(+e.target.value)}
                        label="Процент скидки"
                        style={{ width: '170px' }}
                    />
                    <FormControl style={{ minWidth: '170px' }}>
                        <InputLabel id="discount-label">Услуги</InputLabel>
                        <Select
                            disabled={!isEnabledDiscount}
                            labelId="discount-label"
                            multiple
                            value={discountServices}
                            onChange={e => handleChangeService(e, 'discount')}
                            renderValue={renderSelectValue}

                            input={<OutlinedInput label="Услуги" />}
                        >
                            {state.services.map(service =>
                                <MenuItem key={service._id} value={service._id}>
                                    <Checkbox checked={discountServices.indexOf(service._id) > -1} />
                                    <ListItemText primary={service.title} />
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </div>
            </StyledPaper>
            <StyledPaper>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <StyledCheckbox
                                checked={isEnabledBirthdayDiscount}
                                onChange={e => setIsEnabledBirthdayDiscount(e.target.checked)}
                            />
                        }
                        label="Включена система скидок на день рождения"
                    />
                </FormGroup>
                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', columnGap: '10px', rowGap: '10px' }}>
                    <TextField
                        disabled={!isEnabledBirthdayDiscount}
                        type='number'
                        value={daysBefore}
                        onChange={e => setDaysBefore(+e.target.value)}
                        label="Дней до дня рождения"
                        style={{ width: '182px' }}
                    />
                    <TextField
                        disabled={!isEnabledBirthdayDiscount}
                        type='number'
                        value={daysAfter}
                        onChange={e => setDaysAfter(+e.target.value)}
                        label="Дней после дня рождения"
                        style={{ width: '182px' }}
                    />
                    <TextField
                        disabled={!isEnabledBirthdayDiscount}
                        type='number'
                        value={birthdayDiscountPercent}
                        onChange={e => setBirthdayDiscountPercent(+e.target.value)}
                        label="Процент скидки"
                        style={{ width: '182px' }}
                    />
                    <FormControl style={{ minWidth: '182px' }}>
                        <InputLabel id="birthday-discount-label">Услуги</InputLabel>
                        <Select
                            disabled={!isEnabledBirthdayDiscount}
                            labelId="birthday-discount-label"
                            multiple
                            value={birthdayDiscountServices}
                            onChange={e => handleChangeService(e, 'birthdayDiscount')}
                            renderValue={renderSelectValue}
                            input={<OutlinedInput label="Услуги" />}
                        >
                            {state.services.map(service =>
                                <MenuItem key={service._id} value={service._id}>
                                    <Checkbox checked={birthdayDiscountServices.indexOf(service._id) > -1} />
                                    <ListItemText primary={service.title} />
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </div>
            </StyledPaper>
            <LoadingButton
                loading={loading}
                variant='contained'
                onClick={handleSubmit}
            >
                Сохранить
            </LoadingButton>
            {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
        </>
    )
}