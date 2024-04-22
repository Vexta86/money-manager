import React, {useEffect, useState} from "react";
import { localhost } from "../util";
import './styles.css';
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";

const SignupPage = ()=> {

    const location = useLocation();
    const language = new URLSearchParams(location.search).get('language');

    const { t, i18n } = useTranslation();
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [msg, setMsg] = useState('');

    const handleSignUpRequest = async () => {
        try {
            console.log(emailInput, passwordInput);
            const response = await fetch('http://'+localhost+'/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                    // Add any other headers as needed
                },
                body: JSON.stringify({
                    email: emailInput.toLowerCase(),
                    password: passwordInput,
                }),
            });
            const jsonData = await response.json();
            setMsg(jsonData.message);
            if(jsonData.ok){
                alert(t("Successful signed up"));
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

            <p>{t("Welcome")}</p>

            <p className="msg">{msg}</p>
            <div className="coolinput">
                <label htmlFor="email1" className="text">{t('Email')}:</label>
                <input type="text"
                       placeholder={'someone@example.com'}
                       name="email1"
                       className="input"
                       value={emailInput}
                       id="email1"

                       onChange={(e) => setEmailInput(e.target.value)}

                />
            </div>

            <div className="coolinput">
                <label htmlFor="password1" className="text">{t("Password")}:</label>
                <input type="password"
                       placeholder={'...'}
                       name="password1"
                       className="input"
                       value={passwordInput}
                       id="password1"

                       onChange={(e) => setPasswordInput(e.target.value)}

                />
            </div>
            <button
                className="btn2"
                onClick={handleSignUpRequest}
            >
                {t("Sign up")}

            </button>

            <p><a href="/login">{t("Log in")}</a></p>


        </div>
    );
}

export default SignupPage;
