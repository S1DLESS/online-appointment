import React from 'react'
import styled from 'styled-components';
import { Avatar, Button, IconButton, Typography, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Groups, List as ListIcon, Event } from '@mui/icons-material'
import { IBranch } from '../models/IBranch';


interface PreviewPageProps {
    bgcolor: string
    bgimage: string | ArrayBuffer
}

const PreviewPage = styled.div<PreviewPageProps>`
    margin-top: 10px;
    width: 800px;
    aspect-ratio: 16 / 9;
    background-color: ${props => props.bgcolor};
    ${props => props.bgimage
        ? `background: url('${props.bgimage}') center center/cover no-repeat;`
        : ''
    }

    @media (max-width: 900px) {
        width: 100%;
    }
`

const PreviewContainer = styled.div`
    margin: 0 auto;
    padding: 0 10px;
    max-width: 36.46%;
    height: 100%;
    backdrop-filter: blur(10px);
`

const Header = styled.div`
    position: relative;
    background-color: #fff;
    padding: 5px 0;
    text-align: center;
`

const CustomerAccountButton = styled(IconButton)`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    padding: 3px;

    & .MuiSvgIcon-root {
        font-size: 14px;
    }
`

const BranchTitle = styled(Typography)`
    font-size: 12px;
    line-height: 1.5;
`

const BranchAddress = styled(Typography)`
    font-size: 8px;
    line-height: 1.5;
`

const List = styled.div`
    margin-top: 5px;

    & >div {
        margin-top: 3px;

        &:first-child {
          margin-top: 0;
        }
    }
`

const Item = styled.div`
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    border-radius: 0.4rem;
    cursor: pointer;
    user-select: none;
`

const ItemMain = styled.div`
    padding: 0.4rem;
    width: 100%;
    display: flex;
    align-items: center;
    text-decoration: none;
`

const StyledAvatar = styled(Avatar)`
    width: 20px;
    height: 20px;

    & .MuiSvgIcon-root {
        font-size: 0.8rem;
    }
`

const Text = styled.div`
    margin-left: 7px;
    display: flex;
    flex-direction: column;

    & .MuiTypography-root {
        font-size: 8px;
        line-height: 1.5;
    }
`

const ConfirmButton = styled(Button)`
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;

    font-size: 7px;
    border-radius: 0.5em;
    padding: 0.4em 1.2em;
    line-height: 2;
`

interface Props {
    color: string
    imagePreview: string | ArrayBuffer
    mainColor: string
    branch: IBranch
}

export default function FormPreview({ color, imagePreview, mainColor, branch }: Props) {

    const theme = useTheme()

    return (
        <PreviewPage
            bgcolor={color}
            bgimage={imagePreview}
        >
            <PreviewContainer>
                <Header>
                    <BranchTitle variant='h4'>{branch.title}</BranchTitle>
                    <CustomerAccountButton>
                        <PersonIcon />
                    </CustomerAccountButton>
                </Header>
                <List>
                    <Item>
                        <ItemMain>
                            <StyledAvatar children={<Groups />} />
                            <Text>
                                <Typography variant='subtitle1'>Выберите специалиста</Typography>
                            </Text>
                        </ItemMain>
                    </Item>
                    <Item>
                        <ItemMain>
                            <StyledAvatar children={<ListIcon />} />
                            <Text>
                                <Typography variant='subtitle1'>Выберите услугу</Typography>
                            </Text>
                        </ItemMain>
                    </Item>
                    <Item>
                        <ItemMain>
                            <StyledAvatar children={<Event />} />
                            <Text>
                                <Typography variant='subtitle1'>Выберите дату и время</Typography>
                            </Text>
                        </ItemMain>
                    </Item>
                </List>
                <ConfirmButton
                    style={mainColor !== theme.palette.primary.main ? { backgroundColor: mainColor } : undefined}
                    variant='contained'
                    fullWidth
                >Продолжить</ConfirmButton>
            </PreviewContainer>
        </PreviewPage>
    )
}