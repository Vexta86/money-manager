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
                className={`menuBtn${selectedButton.includes('/home') ? '-selected' : ''}`}
                onClick={() => handleButtonClick('/money-manager/home')}
            >
                🏠
                <br/>
                {t("Home")}
            </button>

            <button
                className={`menuBtn${selectedButton.includes('/income') ? '-selected' : ''}`}
                onClick={() => handleButtonClick('/money-manager/income')}
            >
                📉
                <br/>
                {t("Income")}
            </button>

            <button
                className={`menuBtn${selectedButton.includes('/outcome') ? '-selected' : ''}`}
                onClick={() => handleButtonClick('/money-manager/outcome')}
            >
                📈
                <br/>
                {t("Expenses")}
            </button>

            <button
                className={`menuBtn${selectedButton.includes('/planner') ? '-selected' : ''}`}
                onClick={() => handleButtonClick('/money-manager/planner')}
            >
                📅
                <br/>
                {t("Planner")}
            </button>
        </nav>
    );
}

export default Menu;

