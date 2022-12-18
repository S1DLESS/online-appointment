import { Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context'
import { setToken } from '../../http'
import { registration } from '../../http/userAPI'
import RegisterStep1 from './register/RegisterStep1'
import RegisterStep2 from './register/RegisterStep2'
import RegisterStep3 from './register/RegisterStep3'


export default function Register() {

    const context = useContext(AuthContext)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [companyTitle, setCompanyTitle] = useState('')
    const [companyDescription, setCompanyDescription] = useState('')
    const [branchTitle, setBranchTitle] = useState('')
    const [branchType, setBranchType] = useState('')
    const [branchDescription, setBranchDescription] = useState('')
    const [branchAddress, setBranchAddress] = useState('')
    const [branchPhone, setBranchPhone] = useState('')
    const [branchWorkingHours, setBranchWorkingHours] = useState('')

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [step, setStep] = useState(1)

    const signUp = () => {
        if (!email || !password || !companyTitle || !branchTitle || !branchType) {
            setErrorMessage('Заполните необходимые поля')
            return
        }
        setErrorMessage('')
        setLoading(true)
        registration({
            username,
            email,
            password,
            companyTitle,
            companyDescription,
            branchTitle,
            branchType,
            branchDescription,
            branchAddress,
            branchPhone,
            // branchWorkingHours
        }).then(res => {
            if (res.token) {
                setToken(res.token)
                context.setLoading(true)
                context.setHasToken(true)
            } else {
                setErrorMessage(res.message)
            }
            setLoading(false)
        })
    }

    return (
        <div>
            <Typography
                variant='h3'
                style={{ textAlign: 'center' }}
            >Регистрация</Typography>
            <Typography
                style={{ marginTop: '30px' }}
            >У вас уже есть учётная запись? <Link to='/admin/login'>Войдите</Link></Typography>
            {step === 1 &&
                <RegisterStep1
                    username={username}
                    setUsername={username => setUsername(username)}
                    email={email}
                    setEmail={email => setEmail(email)}
                    password={password}
                    setPassword={password => setPassword(password)}
                    onChangeStep={setStep}
                />
            }
            {step === 2 &&
                <RegisterStep2
                    companyTitle={companyTitle}
                    setCompanyTitle={companyTitle => setCompanyTitle(companyTitle)}
                    companyDescription={companyDescription}
                    setCompanyDescription={companyDescription => setCompanyDescription(companyDescription)}
                    onChangeStep={setStep}
                />
            }
            {step === 3 &&
                <RegisterStep3
                    branchTitle={branchTitle}
                    setBranchTitle={branchTitle => setBranchTitle(branchTitle)}
                    branchType={branchType}
                    setBranchType={branchType => setBranchType(branchType)}
                    branchDescription={branchDescription}
                    setBranchDescription={branchDescription => setBranchDescription(branchDescription)}
                    branchAddress={branchAddress}
                    setBranchAddress={branchAddress => setBranchAddress(branchAddress)}
                    branchPhone={branchPhone}
                    setBranchPhone={branchPhone => setBranchPhone(branchPhone)}
                    branchWorkingHours={branchWorkingHours}
                    setBranchWorkingHours={branchWorkingHours => setBranchWorkingHours(branchWorkingHours)}
                    onChangeStep={setStep}
                    onRegister={signUp}
                />
            }
            {errorMessage && <Typography>{errorMessage}</Typography>}
        </div>
    )
}