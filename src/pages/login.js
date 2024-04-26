import React, {useEffect, useState} from "react";

// for redirecting and parsing the token
import { useNavigate } from 'react-router-dom';

import { localhost } from "../util";

import './styles.css';

import { useTranslation } from 'react-i18next';
import {Button} from "@mui/material";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {theme} from "../config/ThemeMUI";
import ButtonGroup from '@mui/material/ButtonGroup';
import {ThemeProvider} from "@mui/material/styles";
import Alert from "@mui/material/Alert";



const LoginPage = ()=> {
    const { t, i18n } = useTranslation();

    const [language, setLanguage] = useState('en');


    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [msg, setMsg] = useState('');



    const navigate = useNavigate();

    const handleLoginRequest = async () => {
        try {
            const response = await fetch('http://'+localhost+'/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: JSON.stringify({
                    email: emailInput.toLowerCase(),
                    password: passwordInput,
                }),
            });
            const jsonData = await response.json();
            setMsg(jsonData.message);
            if(jsonData.token){

                // redirects to home page parsing the token

                const auth = 'Bearer ' + jsonData.token;

                navigate('/home', { state: {auth: auth, language: language}});

            }
        } catch (error) {
            setMsg("Error");
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        i18n.changeLanguage(language).then();
    }, [language, i18n]);
    return (
        <div className="container">

            <h1>{t('Money Manager')}</h1>

            <h2>{t('Log in')}</h2>

            <p>{t('Welcome back')}</p>


            <ThemeProvider theme={theme}>
                {msg ? <Alert severity={msg.includes('successful') ? "success" : "error"}>{t(msg)}</Alert> : null}
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': {m: 1, width: '25ch'},
                        'display': 'flex',
                        'flex-direction': 'column'
                    }}
                    noValidate
                    autoComplete="off"
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
                            onClick={handleLoginRequest}
                    >
                        {t('Log in')}
                    </Button>

                </Box>


            </ThemeProvider>


            <p>{t("Don't have an account?")} <a href={`signup?language=${language}`}>{t("Sign up")}</a></p>


            <ThemeProvider theme={theme}>
                <ButtonGroup variant="contained" aria-label="Basic button group">
                    <Button onClick={() => setLanguage('en')}>English</Button>
                    <Button onClick={() => setLanguage('es')}>Español</Button>

                </ButtonGroup>


            </ThemeProvider>

        </div>
    );
}

export default LoginPage;
