import React, {useContext, useEffect, useState} from "react";
import { useLocation} from 'react-router-dom';
import './styles.css';

import {useTranslation} from "react-i18next";
import {theme} from "../config/ThemeMUI";
import {MyContext} from "../App";
import {fetchIncomeData} from "../services/incomeService";

import MainIncomeOutcome from "../components/income-outcome/MainIncomeOutcome";
import {fetchCome} from "../services/mainService";




const IncomePage = () => {

    // receives auth as a parameter when redirecting

    const location = useLocation();
    const auth = location.state?.auth;
    const language = location.state?.language;
    const {t, i18n} = useTranslation();
    const {isAuth, updateIsAuth} = useContext(MyContext);



    const [docs, setDocs] = useState(null);
    const [monthCategories, setMonthCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchIncome = async (month, year) => {

       const data = await fetchCome(fetchIncomeData, auth, month, year, setIsLoading)
        setDocs(data.docs)
        setMonthCategories(data.categories)
       return(data)
    };





    return (

           <>
               <MainIncomeOutcome auth={auth} docs={docs} language={language}
                                  theme={theme} monthCategories={monthCategories}
                                  isLoading={isLoading} fetchCome={fetchIncome}
                                  fetchData={fetchIncomeData}
                                  name={'Income'} type={'incomes'}
               />
           </>

    );
}
export default IncomePage;
