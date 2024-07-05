import React, {useEffect, useState} from "react";
import { API_URL } from "../util";
import './styles.css';
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {theme} from "../config/ThemeMUI";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {Button, Stack, Typography} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import Alert from '@mui/material/Alert';
import LinearProgress from "@mui/material/LinearProgress";
import {fieldTypoStackSx, insideStackSx, mainStackSx, msgBoxSx, typoLinkSx} from "../config/SxStyles";
import Header from "../components/login-signup/Header";
import LoadingMessage from "../components/login-signup/LoadingMessage";
import LanguageSelector from "../components/login-signup/LanguageSelector";

function isValidEmail(email) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidPassword(password) {
    // Password must be at least 6 characters long, have at least one uppercase letter,
    // one lowercase letter, and at least one number
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return passwordRegex.test(password);
}

function titleCase(str) {
    // Split the string into words
    const words = str.split(' ');

    // Capitalize each word
    const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // Join the capitalized words back into a single string
    return capitalizedWords.join(' ');
}
const SignupPage = ()=> {

    const location = useLocation();

    const [language, setLanguage] = useState(location.state?.language ? location.state?.language : 'es');


    const { t, i18n } = useTranslation();
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordInput2, setPasswordInput2] = useState('');
    const [nameInput, setNameInput] = useState('')
    const [msg, setMsg] = useState('');

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        i18n.changeLanguage(language).then();
    }, [language, i18n]);
    const handleSignUpRequest = async () => {


        if (!nameInput || nameInput.length < 3){
            setMsg(t('Oops! Please check your name and try again.'))
        }else if (!isValidEmail(emailInput)){
            setMsg(t('Oops! Please check your email and try again.'))
        } else if (!isValidPassword(passwordInput) ){
            setMsg(t('Oops! Please check your password and try again.'))
        }
        else if (passwordInput !== passwordInput2){
            setMsg(t("Passwords do not match"))
        }
        else {
            setIsLoading(true)
            fetch(API_URL+'/user/signup',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                    // Add any other headers as needed
                },
                body: JSON.stringify({
                    email: emailInput.toLowerCase(),
                    password: passwordInput,
                    name: titleCase(nameInput),
                }),
            }).then(res=>{
                return res.json()
            }).then(data => {
                if (data.ok){
                    setMsg(t("Congratulations! Your account has been successfully created."));

                }
                setMsg(data.error.message);

            }).catch(err => {
                console.log(err)
            }).finally(()=>{
                setIsLoading(false)
            })
        }



    };
    useEffect(() => {
        i18n.changeLanguage(language).then();
        console.log(language)

    }, [language, i18n]);

    useEffect(()=> {
        setMsg('')
    }, [emailInput, nameInput, passwordInput])

    return (
        <ThemeProvider theme={theme}>
        <Stack sx={mainStackSx}>


            <Header/>

            <Stack sx={insideStackSx}>
                <Typography variant={'h2'} color={'primary'}>{t('Sign up')}</Typography>

                <Typography>{t('Welcome! Let\'s get started with your account creation.')}</Typography>

            </Stack>







                <Stack
                    component="form"
                    sx={insideStackSx}
                    noValidate
                    autoComplete="off"
                >

                    <Stack sx={fieldTypoStackSx}>
                        <Typography variant={'h3'} color={'primary'}>1.</Typography>
                        <Typography>{t('Enter your full name')}</Typography>
                        <TextField id="name"
                                   label={t("Name")}
                                   variant="standard"
                                   required
                                   value={nameInput}
                                   onChange={(e) => setNameInput(e.target.value)}
                        />
                    </Stack>


                    <Stack sx={fieldTypoStackSx}>
                        <Typography variant={'h3'} color={'primary'}>2.</Typography>
                        <Typography>{t('Provide your email address to receive updates and account notifications.')}</Typography>
                        <TextField id="email"
                                   required
                                   label={t("Email")}
                                   variant="standard"
                                   value={emailInput}

                                   onChange={(e) => setEmailInput(e.target.value)}
                        />
                    </Stack>

                    <Stack sx={fieldTypoStackSx}>
                        <Typography variant={'h3'} color={'primary'}>3.</Typography>
                        <Typography>{t('Create a password with at least 6 characters, including uppercase, lowercase, and a number.')}</Typography>
                        <TextField id="password"
                                   label={t("Password")}
                                   variant={'standard'}
                                   required
                                   value={passwordInput}
                                   type='password'

                                   onChange={(e) => setPasswordInput(e.target.value)}
                        />
                    </Stack>

                    <Stack sx={fieldTypoStackSx}>
                        <Typography variant={'h3'} color={'primary'}>4.</Typography>
                        <Typography>{t('Confirm your password to ensure accuracy')}</Typography>
                        <TextField id="password"
                                   error={passwordInput!==passwordInput2}
                                   label={t("Repeat Password")}
                                   variant="standard"
                                   required
                                   value={passwordInput2}
                                   type='password'
                                   onChange={(e) => setPasswordInput2(e.target.value)}
                        />
                    </Stack>


                    <Stack sx={fieldTypoStackSx}>
                        <Typography variant={'h3'} color={'primary'}>5.</Typography>
                        <Typography>{t('Ready to get started?')}</Typography>
                        <Button variant="contained"
                                theme={theme}
                                onClick={handleSignUpRequest}
                                sx={{margin:'4%'}}
                        >
                            {t('Sign up')}
                        </Button>
                        <LoadingMessage isLoading={isLoading} msg={msg}/>
                    </Stack>



                </Stack>

            <Stack sx={insideStackSx}>
                <Typography sx={typoLinkSx} onClick={()=>{
                    navigate('/money-manager/login', { state: {language: language}})
                }}>{t("Log in")}</Typography>
            </Stack>


            <LanguageSelector setLanguage={setLanguage}/>


        </Stack>
        </ThemeProvider>
    );
}

export default SignupPage;
