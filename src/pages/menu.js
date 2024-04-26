import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import SvgIcon from '@mui/material/SvgIcon';


function Menu({ auth, language }) {

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedButton, setSelectedButton] = useState(location.pathname);

    const handleButtonClick = (path) => {
        setSelectedButton(path);
        navigate(path, { state: { auth: auth, language: language } });
    };

    useEffect(() => {
        i18n.changeLanguage(language);
    }, []);

    return (
        <nav className='menu'>
            <button
                className={`menuBtn${selectedButton === '/home' ? '-selected' : ''}`}
                onClick={() => handleButtonClick('/home')}
            >
                🏠
                <br/>
                {t("Home")}
            </button>

            <button
                className={`menuBtn${selectedButton === '/income' ? '-selected' : ''}`}
                onClick={() => handleButtonClick('/income')}
            >
                📉
                <br/>
                {t("Income")}
            </button>

            <button
                className={`menuBtn${selectedButton === '/outcome' ? '-selected' : ''}`}
                onClick={() => handleButtonClick('/outcome')}
            >
                📈
                <br/>
                {t("Expenses")}
            </button>

            <button
                className={`menuBtn${selectedButton === '/planner' ? '-selected' : ''}`}
                onClick={() => handleButtonClick('/planner')}
            >
                📅
                <br/>
                {t("Planner")}
            </button>
        </nav>
    );
}

export default Menu;

