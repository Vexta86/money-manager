import React, {useState, useEffect} from "react";
import {Navigate, useLocation, useNavigate} from 'react-router-dom';

import {localhost} from "../util";
import './styles.css';

import Menu from './menu'
import {useTranslation} from "react-i18next";

const HomePage = () => {

    const { t, i18n } = useTranslation();

    // receives auth as a parameter when redirecting

    const location = useLocation();
    const language = location.state?.language;

    const [auth, setAuth] = useState(location.state?.auth);

    const current_date = new Date();
    const [authenticated, setAuthenticated] = useState(!!auth); // Set authenticated based on token existence
    const [user, setUser] = useState("");

    const navigate = useNavigate();


    useEffect(() => {
        i18n.changeLanguage(language);
        if (!auth) {
            return; // No need to make API call if token doesn't exist
        }

        fetch(`http://${localhost}/incomes?month=${current_date.getMonth() + 1}&year=${current_date.getFullYear()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': auth,
            },
        }).then((response) => {
            if (!response.ok) {
                setAuthenticated(false);
                throw new Error('Network response was not ok');
            }
            setAuthenticated(true);
            return response.json();
        }).then(data => {

            setUser(data.userData.email);

        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [auth, language]);

    if (!authenticated) {
        return <Navigate to='/login' />;
    }
    return (
        <div>
            <div className="container">
                <h1>{t("Money Manager")}</h1>

                <p>{t("Hello")} {user.name ? user.name : null}</p>

                <button className="btn1" onClick={()=>{
                    navigate('/login');
                    setAuth(null);
                }}>
                    {t("Log out")}
                </button>
            </div>
            <div className="menuContainer">
                <Menu auth={auth} language={language}/>

            </div>
        </div>
        
    );
}
export default HomePage;
