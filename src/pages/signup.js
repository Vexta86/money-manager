import React, {useEffect, useState} from "react";
import { localhost } from "../util";
import './styles.css';
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {theme} from "../config/ThemeMUI";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import Alert from '@mui/material/Alert';
import LinearProgress from "@mui/material/LinearProgress";


const SignupPage = ()=> {

    const location = useLocation();
    const language = location.state?.language;



    const { t, i18n } = useTranslation();
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [nameInput, setNameInput] = useState('')
    const [msg, setMsg] = useState('');

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const handleSignUpRequest = async () => {
        setIsLoading(true)
        fetch(localhost+'/user/signup',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                        // Add any other headers as needed
                    },
                    body: JSON.stringify({
                        email: emailInput.toLowerCase(),
                        password: passwordInput,
                        name: nameInput,
                    }),
                }).then(res=>{
                    return res.json()
        }).then(data => {
            setIsLoading(false)
            if (data.ok){
                alert(t("Successful signed up"));
                navigate(-1);
            }
            setMsg(data.message ? data.message : data.error.message);

        }).catch(err => {
            console.log(err)
        })

    };
    useEffect(() => {
        i18n.changeLanguage(language).then();
        console.log(language)

    }, [language, i18n]);

    useEffect(()=> {
        setMsg('')
    }, [emailInput, nameInput, passwordInput])

    return (
        <div className="container">

            <h1>{t('Money Manager')}</h1>
            <h2>{t('Sign up')}</h2>

            <p>{t("Welcome")}</p>


            <ThemeProvider theme={theme}>

                <Box sx={{width:"35%"}}>
                    {msg ?
                        <Alert severity={msg.includes('success') ? "success" : "error"}>
                            {t(msg)}
                        </Alert> :
                        null}
                    {isLoading ?
                        <LinearProgress/> :
                        null
                    }

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

                    <TextField id="name"
                               label={t("Name")}
                               variant="outlined"
                               error={!nameInput}

                               value={nameInput}

                               onChange={(e) => setNameInput(e.target.value)}
                    />
                    <TextField id="email"
                               error={!emailInput}
                               label={t("Email")}
                               variant="outlined"
                               theme={theme}
                               value={emailInput}

                               onChange={(e) => setEmailInput(e.target.value)}
                    />

                    <TextField id="password"
                               error={!passwordInput}
                               label={t("Password")}
                               variant="outlined"
                               theme={theme}
                               value={passwordInput}
                               type='password'
                               onChange={(e) => setPasswordInput(e.target.value)}
                    />


                    <Button variant="contained"
                            theme={theme}
                            onClick={handleSignUpRequest}
                    >
                        {t('Sign up')}
                    </Button>

                </Box>


            </ThemeProvider>

            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <p> <a style={{color: "blue", cursor: "pointer", textDecoration: "underline"}} onClick={()=>{
                navigate('/money-manager/login', { state: {language: language}})
            }}>{t("Log in")}</a></p>


        </div>
    );
}

export default SignupPage;
