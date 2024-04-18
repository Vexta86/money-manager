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
        i18n.changeLanguage(language);

    }, []);


    return (
        <div className="container">

            <h1>{t('Money Manager')}</h1>

            <p>{t("Welcome")}</p>

            <p className="msg">{msg}</p>
            <label htmlFor="email1">{t("Email")}</label>
            <input
                value={emailInput}
                id="email1"
                className="inputLogIn"
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={t("Email")}
            />
            <label htmlFor="password1">{t("Password")}</label>
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
                onClick={handleSignUpRequest}
            >
                {t("Sign up")}

            </button>

            <p><a href="login">{t("Log in")}</a></p>


        </div>
    );
}

export default SignupPage;
