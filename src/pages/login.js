import React, {useEffect, useState} from "react";

// for redirecting and parsing the token
import { useNavigate } from 'react-router-dom';

import { localhost } from "../util";

import './styles.css';

import { useTranslation } from 'react-i18next';




const LoginPage = ()=> {
    const { t, i18n } = useTranslation();

    const [language, setLanguage] = useState('en');


    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [msg, setMsg] = useState('');



    const navigate = useNavigate();

    const handleLoginRequest = async () => {
        try {
            console.log(emailInput, passwordInput);
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
                console.log(auth)
                navigate('/home', { state: {auth: auth, language: language}});

            }
        } catch (error) {
            setMsg("Error");
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);
    return (
        <div className="container">

            <h1>{t('Money Manager')}</h1>

            <p>{t('Welcome back')}</p>

            <p className="msg">{msg}</p>

            <label htmlFor="email1">{t('Email')}</label>

            <input
                value={emailInput}
                id="email1"
                className="inputLogIn"
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={t("Email")}
            />

            <label htmlFor="password1">{t('Password')}</label>
            <input
                type="password"
                id="password1"
                className="inputLogIn"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={t("Password")}
            />
            <button
                className="btn1"
                onClick={handleLoginRequest}
            >
                {t('Log in')}

            </button>

            <p>{t("Don't have an account?")} <a href={`signup?language=${language}`}>{t("Sign up")}</a></p>

            <div className='options'>
                {/* Language change buttons */}
                <button className='btn1' onClick={() => setLanguage('en')}>English</button>
                <button className='btn1' onClick={() => setLanguage('es')}>Español</button>
            </div>

        </div>
    );
}

export default LoginPage;
