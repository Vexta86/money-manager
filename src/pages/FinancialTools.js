import {CardActionArea, CardContent, Typography} from "@mui/material";
import './styles.css';
import '../financial-tools/tools.css'
import ToolCard from "../modules/ToolCard";
import Menu from "../modules/menu";
import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";

const FinancialTools = ()=>{

    const location = useLocation();
    const auth = location.state?.auth;
    const language = location.state?.language;

    const {t, i18n} = useTranslation();

    function pushNotification(){
        if( !window.Notification ){
            console.error('Device does not support notifications');
            return;
        }

        if(Notification.permission === 'granted'){


        } else if(Notification.permission !== 'denied' || Notification.permission === 'default'){

            Notification.requestPermission((permission)=>{

                console.log(permission);
                if (permission === 'granted'){
                    new Notification('This is how you will be notified');
                }
            })

        }

    }

    useEffect(() => {
        pushNotification()
    }, []);


    return(<div className={'container'}>
        <h1>{t("Financial Tools")}</h1>

        <div className={'tools-container'}>
            <ToolCard name={t('Monthly Expenses')}
                      description={'A tool for planning your monthly expenses'}
                      link={'/money-manager/financial-tools/planner'}
                      auth={auth}
            />
            <ToolCard name={t('Monthly Savings')}
                      description={'A tool for planning your monthly savings'}
                      link={'/money-manager/financial-tools/savings'}
                      auth={auth}
            />
            <ToolCard name={t('Compount Interest Calculator')}
                      description={'A tool for planning your investments'}
                      link={language === 'es' ? 'https://www.investor.gov/financial-tools-calculators/calculators/calculadora-de-interes-compuesto' : 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator'}
                      auth={auth}
            />


        </div>

        <div className="menuContainer">
            <Menu auth={auth} language={language}/>

        </div>

    </div>)
}

export default FinancialTools;