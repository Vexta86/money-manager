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


const SignupPage = ()=> {

    const location = useLocation();
    const language = new URLSearchParams(location.search).get('language');



    const { t, i18n } = useTranslation();
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [nameInput, setNameInput] = useState('')
    const [msg, setMsg] = useState('');

    const navigate = useNavigate();
    const handleSignUpRequest = async () => {

        try {
            console.log(emailInput, passwordInput);
            const response = await fetch(localhost+'/user/signup', {
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
            });
            const jsonData = await response.json();
            setMsg(jsonData.message ? jsonData.message : jsonData.error.message);
            if(jsonData.ok){
                alert(t("Successful signed up"));
                navigate(-1)
            } else  {
                setMsg(jsonData.message ? jsonData.message : jsonData.error.message);

            }
        } catch (error) {
            setMsg('Server error');
            console.error('Error fetching data:', error.toString());
        }
    };
    useEffect(() => {
        i18n.changeLanguage(language).then();

    }, [language, i18n]);


    return (
        <div className="container">

            <h1>{t('Money Manager')}</h1>
            <h2>{t('Sign up')}</h2>

            <p>{t("Welcome")}</p>


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
            <p> <a onClick={()=>{
                navigate('/money-manager/login')
            }}>{t("Log in")}</a></p>


        </div>
    );
}

export default SignupPage;
