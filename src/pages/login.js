import React, {useEffect, useState} from "react";

// for redirecting and parsing the token
import {useLocation, useNavigate} from 'react-router-dom';

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
import LinearProgress from '@mui/material/LinearProgress';



const LoginPage = ()=> {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [language, setLanguage] = useState(location.state?.language ? location.state?.language : 'es');


    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [msg, setMsg] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLoginRequest = async () => {
        setIsLoading(true);

        fetch(localhost+'/user/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
            body: JSON.stringify({
                email: emailInput.toLowerCase(),
                password: passwordInput,
            })
        }).then(res=>{

            return res.json()
        }).then(data =>{
            if (data.token){
                const auth = 'Bearer ' + data.token;

                navigate('/money-manager/home', { state: {auth: auth, language: language}});
            }
            setMsg(data.message);

            setIsLoading(false)
        }).catch(err=>{
            setMsg('Something went wrong')
        })
        // try {
        //     const response = await fetch(, ),
        //     });
        //     const jsonData = await response.json();
        //     setMsg(jsonData.message);
        //     if(jsonData.token){
        //
        //         // redirects to home page parsing the token
        //
        //         const auth = 'Bearer ' + jsonData.token;
        //         setIsLoading(false)
        //
        //
        //     }
        //     setIsLoading(false)
        // } catch (error) {
        //     setIsLoading(false)
        //     setMsg("Error");
        //     console.error('Error fetching data:', error);
        // }
    };




    useEffect(() => {

        i18n.changeLanguage(language).then();
    }, [language, i18n]);
    useEffect(()=>{
        setMsg('')
    }, [passwordInput, emailInput])
    return (
        <div className="container">

            <h1>{t('Money Manager')}</h1>

            <h2>{t('Log in')}</h2>

            <p>{t('Welcome back')}</p>


            <ThemeProvider theme={theme}>

                <Box sx={{width:"35%"}}>
                    {msg ?
                        <Alert severity={msg.includes('successful') ? "success" : "error"}>
                            {t(msg)}
                        </Alert> :
                        null}
                    {isLoading ?
                        <LinearProgress/> :
                        null }

                </Box>

                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': {m: 1, width: '25ch'},
                        'display': 'flex',
                        'flexDirection': 'column'
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


            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <p>{t("Don't have an account?")} <a style={{color: "blue", cursor: "pointer", textDecoration: "underline"}} onClick={()=>{
                navigate('/money-manager/signup', { state: {language: language}});
            }}>{t("Sign up")}</a></p>


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
