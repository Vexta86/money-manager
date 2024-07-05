import React, {useState, useEffect, useContext} from "react";
import { useLocation  } from 'react-router-dom';

import {paletteRed, themeRed} from "../config/ThemeMUI";

import {MyContext} from "../App";

import {fetchOutcomeData} from "../services/outcomeService";

import MainIncomeOutcome from "../components/income-outcome/MainIncomeOutcome";

import {fetchCome} from "../services/mainService";





const OutcomePage = () => {
    const location = useLocation();
    const auth = location.state?.auth;
    const language = location.state?.language;
    const {updateIsAuth} = useContext(MyContext);


    const [docs, setDocs] = useState(null);
    const [monthCategories, setMonthCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const fetchOutcomes = async (month, year) => {
        const data = await fetchCome(fetchOutcomeData, auth, month, year, setIsLoading)
        setDocs(data.docs)
        setMonthCategories(data.categories)
        return data

    }




    return (
        <>
            <MainIncomeOutcome auth={auth} docs={docs} language={language}
                               theme={themeRed} monthCategories={monthCategories}
                               isLoading={isLoading} fetchCome={fetchOutcomes}
                               fetchData={fetchOutcomeData}
                               palette={paletteRed}
                               name={'Expenses'} type={'outcomes'}
            />
        </>

    );
}
export default OutcomePage;
