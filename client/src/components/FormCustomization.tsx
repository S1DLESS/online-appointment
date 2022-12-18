import LoadingButton from '@mui/lab/LoadingButton'
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material'
import { useTheme } from '@mui/system'
import React, { useContext, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import styled from 'styled-components'
import { AdminContext } from '../context'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { editFormBranch } from '../http/branchAPI'
import { IBranch } from '../models/IBranch'
import { updateAdminData } from '../store/actions'
import FormPreview from './FormPreview'
import { SelectChangeEvent } from '@mui/material/Select'


const Customization = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    @media (max-width: 1420px) {
        flex-direction: column;
        row-gap: 15px;
        align-items: flex-start;
    }
`

interface StyledPaperProps {
    block?: string
}

const StyledPaper = styled(Paper) <StyledPaperProps>`
    padding: 10px;
    ${props => props.block === 'bg' ? 'min-width: 270px;' : ''}
    ${props => props.block === 'preview'
        ? '@media (max-width: 900px) { width: 100%; }'
        : ''
    }
`

const Controls = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 15px;

    @media (max-width: 1420px) {
        flex-direction: row;
        column-gap: 15px;
    }

    @media (max-width: 600px) {
        flex-direction: column;
    }
`

const Header = styled(Typography)`
    line-height: 1;
`

export default function FormCustomization() {

    const theme = useTheme()

    const { branchId } = useContext(AdminContext)

    const { branches } = useAppSelector(state => state.admin)
    const dispatch = useAppDispatch()
    const branch = branches.find(branch => branch._id === branchId) || {} as IBranch

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [backgroundType, setBackgroundType] = useState(branch.form_settings.background.type === 'color' && branch.form_settings.background.src === '#f4f6f8' ? 'default' : branch.form_settings.background.type)
    const [mainColorType, setMainColorType] = useState(branch.form_settings.main_color === theme.palette.primary.main ? 'default' : 'color')

    const [color, setColor] = useState(branch.form_settings.background.type === 'color' ? branch.form_settings.background.src : '#f4f6f8');
    const [colorInPicker, setColorInPicker] = useState(color)

    const [inputFile, setInputFile] = useState<File>({} as File)
    const [imagePreview, setImagePreview] = useState<string | ArrayBuffer>(branch.form_settings.background.type === 'image' ? `${process.env.REACT_APP_API_URL}/formBackgrounds/${branch.form_settings.background.src}` : '')

    const [mainColor, setMainColor] = useState(branch.form_settings.main_color)
    const [mainColorInPicker, setMainColorInPicker] = useState(mainColor)

    const handleChangeBackgroundType = (e: SelectChangeEvent<string>) => {
        if (e.target.value === 'default') {
            setColorInPicker(color)
            setColor('#f4f6f8')
            setImagePreview('')
            setInputFile({} as File)
        }
        if (e.target.value === 'color') {
            setColor(colorInPicker)
            setImagePreview('')
            setInputFile({} as File)
        }
        if (e.target.value === 'image') {
            setColorInPicker(color)
            setColor('#f4f6f8')
        }
        setBackgroundType(e.target.value)
    }

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputFile(e.target.files ? e.target.files[0] : {} as File)
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files ? e.target.files[0] : {} as File)
        reader.onloadend = () => setImagePreview(reader.result || '')
    }

    const handleChangeColor = (e: SelectChangeEvent<string>) => {
        if (e.target.value === 'default') {
            setMainColorInPicker(mainColor)
            setMainColor(theme.palette.primary.main)
        }
        if (e.target.value === 'color') {
            setMainColor(mainColorInPicker)
        }
        setMainColorType(e.target.value)
    }

    const handleSubmit = () => {
        setLoading(true)

        const formData = new FormData()
        formData.append('bgColor', color)
        if (backgroundType === 'image' && inputFile) {
            formData.append('bgImage', inputFile)
        }
        formData.append('main_color', mainColor)

        editFormBranch(formData, branchId).then(res => {
            if (res.branches) {
                dispatch(updateAdminData(res.branches))
            } else {
                setErrorMessage(res.message)
            }
            setLoading(false)
        })
    }

    return (
        <>
            <Customization>
                <Controls>
                    <StyledPaper block='bg'>
                        <Header variant='h6'>Настройка фона</Header>
                        <FormControl style={{ marginTop: '20px' }}>
                            <InputLabel id='change-backgroundType'>Тип</InputLabel>
                            <Select
                                label='Тип'
                                labelId="change-backgroundType"
                                value={backgroundType}
                                onChange={handleChangeBackgroundType}
                            >
                                <MenuItem value={'default'}>По умолчанию</MenuItem>
                                <MenuItem value={'color'}>Сплошной цвет</MenuItem>
                                <MenuItem value={'image'}>Картинка</MenuItem>
                            </Select>
                        </FormControl>
                        <div>
                            {backgroundType === 'color' &&
                                <HexColorPicker
                                    color={color}
                                    onChange={setColor}
                                    style={{ marginTop: '10px' }}
                                />
                            }
                            {backgroundType === 'image' &&
                                <>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        style={{ marginTop: '10px' }}
                                    >
                                        Загрузить картинку
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/jpeg, image/png"
                                            onChange={handleChangeImage}
                                        />
                                    </Button>
                                    {inputFile &&
                                        <Typography
                                            noWrap
                                            style={{ marginTop: '2px', maxWidth: '250px' }}
                                        >{inputFile.name}</Typography>
                                    }
                                </>
                            }
                        </div>
                    </StyledPaper>
                    <StyledPaper>
                        <Header variant='h6'>Настройка главного цвета</Header>
                        <FormControl style={{ marginTop: '20px' }}>
                            <InputLabel id='change-mainColor'>Главный цвет</InputLabel>
                            <Select
                                label='Главный цвет'
                                labelId="change-mainColor"
                                value={mainColorType}
                                onChange={handleChangeColor}
                            >
                                <MenuItem value={'default'}>По умолчанию</MenuItem>
                                <MenuItem value={'color'}>Свой цвет</MenuItem>
                            </Select>
                        </FormControl>
                        {mainColorType === 'color' &&
                            <HexColorPicker
                                color={mainColor}
                                onChange={setMainColor}
                                style={{ marginTop: '10px' }}
                            />
                        }
                    </StyledPaper>
                </Controls>
                <StyledPaper block='preview'>
                    <Header variant='h6'>Предпросмотр</Header>
                    <FormPreview
                        color={color}
                        imagePreview={imagePreview}
                        mainColor={mainColor}
                        branch={branch}
                    />
                </StyledPaper>
            </Customization>
            <LoadingButton
                loading={loading}
                onClick={handleSubmit}
                variant='contained'
                style={{ marginTop: '15px' }}
            >Сохранить</LoadingButton>
            {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
        </>
    )
}