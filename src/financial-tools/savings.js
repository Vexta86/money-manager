import React from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {themeRed} from "../config/ThemeMUI";
import {CircularProgress, Container, Icon} from "@mui/material";
import {formatMoney} from "../util";
import QuickInput from "../components/income-outcome/quickInput";
import {t} from "i18next";
import {useNavigate} from "react-router-dom";

const Savings = () => {
    const navigate = useNavigate();
    return (
        <ThemeProvider theme={themeRed}>
            <Container   sx={{ backgroundColor: themeRed.palette.primary.light, padding: '8% 4% 8% 4%', minHeight:'100vh', height: '100%', alignItems:'center'}}>


                <h1>
                    <a onClick={() => {
                        navigate(-1)
                    }}>
                        <Icon>arrow_back</Icon>
                    </a>


                    {t('Monthly Savings')}
                </h1>









            </Container>
        </ThemeProvider>
    );
};

export default Savings;