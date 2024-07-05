import React, {useContext, useEffect, useState} from "react";

// for redirecting and parsing the token
import {useLocation, useNavigate} from 'react-router-dom';

import { API_URL } from "../util";

import './styles.css';

import { useTranslation } from 'react-i18next';
import {Button, Container, Stack, Typography, useMediaQuery} from "@mui/material";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {theme} from "../config/ThemeMUI";
import ButtonGroup from '@mui/material/ButtonGroup';
import {ThemeProvider} from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import LinearProgress from '@mui/material/LinearProgress';
import {MyContext} from "../App";
import {loginUser} from "../services/authService";
import {insideStackSx, mainStackSx, msgBoxSx, typoLinkSx} from "../config/SxStyles";
import Header from "../components/login-signup/Header";
import LanguageSelector from "../components/login-signup/LanguageSelector";



const LoginPage = ()=> {

    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [language, setLanguage] = useState(location.state?.language ? location.state?.language : 'es');


    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [msg, setMsg] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const {updateIsAuth} = useContext(MyContext);

    const navigate = useNavigate();

    const handleLoginRequest = async () => {
        setIsLoading(true);
        try {
            const data = await loginUser(emailInput, passwordInput);
            if (data.token) {
                const auth = 'Bearer ' + data.token;
                updateIsAuth(true);
                navigate('/money-manager/home', { state: { auth: auth, language: language } });
            }
            setMsg(data.message);
        } catch (err) {
            updateIsAuth(false);
            setMsg('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };




    useEffect(() => {

        i18n.changeLanguage(language).then();
    }, [language, i18n]);
    useEffect(()=>{
        setMsg('')
    }, [passwordInput, emailInput])
    return (
        <ThemeProvider theme={theme}>
            <Stack sx={mainStackSx}>

                <Header/>

                <Stack sx={insideStackSx}>
                    <Typography variant={'h2'} color={'primary'}>{t('Log in')}</Typography>

                    <Typography>{t('Welcome back')}</Typography>

                </Stack>



                <Stack
                    id={'login-form'}
                    component="form"
                    sx={insideStackSx}

                    noValidate
                    autoComplete="off"
                    onSubmit={(e)=>{
                        e.preventDefault()

                        handleLoginRequest()
                    }}
                >

                    <TextField id="email"
                               label={t("Email")}
                               variant="outlined"

                               value={emailInput}

                               onChange={(e) => setEmailInput(e.target.value)}
                    />

                    <TextField id="password"
                               label={t("Password")}
                               variant="outlined"

                               value={passwordInput}
                               type='password'
                               onChange={(e) => setPasswordInput(e.target.value)}
                    />


                    <Button variant="contained"
                            theme={theme}
                            type={'submit'}
                            // onClick={handleLoginRequest}
                    >
                        {t('Log in')}
                    </Button>

                </Stack>
                <Box id={'loading'} sx={msgBoxSx}>
                    {msg ?
                        <Alert severity={msg.includes('successful') ? "success" : "error"}>
                            {t(msg)}
                        </Alert> :
                        null}
                    {isLoading ?
                        <LinearProgress/> :
                        null }

                </Box>
                <Stack sx={insideStackSx}>
                    <Typography>
                        {t("Don't have an account?")}
                    </Typography>

                    <Typography sx={typoLinkSx} onClick={()=>{
                        navigate('/money-manager/signup', { state: {language: language}});}}>
                        {t("Sign up")}
                    </Typography>

                </Stack>


                <LanguageSelector setLanguage={setLanguage}/>
            </Stack>

        </ThemeProvider>





    );
}

export default LoginPage;
