import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import { green, red } from '@mui/material/colors';
import {Icon} from "@mui/material";


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
                <Icon>home</Icon>
                <br/>
                {t("Home")}
            </button>

            <button
                className={`menuBtn${selectedButton.includes('/income') ? '-selected' : ''}`}
                onClick={() => handleButtonClick('/money-manager/income')}
            >
                <Icon sx={{ color: green[500] }}>trending_up</Icon>
                <br/>
                {t("Income")}
            </button>

            <button
                className={`menuBtn${selectedButton.includes('/outcome') ? '-selected' : ''}`}
                onClick={() => handleButtonClick('/money-manager/outcome')}
            >
                <Icon sx={{ color: red[500] }}>trending_down</Icon>
                <br/>
                {t("Expenses")}
            </button>

            <button
                className={`menuBtn${selectedButton.includes('/planner') ? '-selected' : ''}`}
                onClick={() => handleButtonClick('/money-manager/financial-tools')}
            >
                <Icon>calculate</Icon>
                <br/>
                {t("Tools")}
            </button>
        </nav>
    );
}

export default Menu;

