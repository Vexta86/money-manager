import React, {useState, useEffect, useContext} from "react";
import { Navigate, useLocation  } from 'react-router-dom';
import { parseToDate, localhost} from "../util";

import Menu from '../modules/menu'
import {useTranslation} from "react-i18next";

import dayjs from "dayjs";
import QuickInput from "../modules/quickInput";
import Table from "../modules/Table";
import FilterMonth from "../modules/FilterMonth";
import FilterCategory from "../modules/FilterCategory";

import {ThemeProvider} from "@mui/material/styles";
import {themeRed} from "../config/ThemeMUI";
import LinearProgress from "@mui/material/LinearProgress";
import {MyContext} from "../App";





const OutcomePage = () => {

    // receives auth as a parameter when redirecting

    const location = useLocation();
    const auth = location.state?.auth;
    const language = location.state?.language;

    const {t, i18n} = useTranslation();


    const current_date = new Date();
    const {isAuth, updateIsAuth} = useContext(MyContext);


    const [docs, setDocs] = useState(null);

    const [month, setMonth] = useState(current_date.getMonth() + 1);
    const [year, setYear] = useState(current_date.getFullYear());

    const [monthCategories, setMonthCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [selectedDate, setSelectedDate] = useState(dayjs(current_date));

    const [isLoading, setIsLoading] = useState(true);

    async function changeSelectedDate(date) {
        setSelectedDate(date);
        const selectedMonth = date.month() + 1;
        const selectedYear = date.year();
        setMonth(selectedMonth);
        setYear(selectedYear);
        fetchOutcomes();

    }

    async function changeCategory(newCategory) {

        const selectedCategory = newCategory;
        setSelectedCategory(selectedCategory);
    }

    function fetchOutcomes() {
        setIsLoading(true)
        fetch(`${localhost}/outcomes?month=${month}&year=${year}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': auth,
            },
        }).then((response) => {

            if (!response.ok) {
                updateIsAuth(false);
                throw new Error('Network response was not ok');
            }
            updateIsAuth(true);
            return response.json();

        }).then(data => {



            const orderedDocs = data.docs.sort((a,b)=>{
                return b.date.localeCompare(a.date);
            })
            setDocs(orderedDocs)

            const uniqueCategories = new Set(data.docs.map(i => i.category));
            const uniqueCategoryArray = Array.from(uniqueCategories);
            setMonthCategories(uniqueCategoryArray);

            setIsLoading(false)

        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    useEffect(() => {
        fetchOutcomes()
        i18n.changeLanguage(language).then();

        if (!auth) {
            return; // No need to make API call if token doesn't exist
        }

        setSelectedCategory('')

    }, []);
    useEffect(() => {
        fetchOutcomes()
    }, [year, month]);


    if (!isAuth) {
        return <Navigate to='/money-manager/login' />;
    }
    return (
        <div >
            <div className="container-red">

                <h1>
                    {t("Expenses in")} { parseToDate(month.toString() + '-' + year.toString(), language) }
                </h1>

                <div className="filterContainer">
                    <FilterMonth changeDate={changeSelectedDate} selectedDate={selectedDate}/>

                    <FilterCategory selectedCategory={selectedCategory}
                                    changeCategory={changeCategory}
                                    monthCategories={monthCategories}    />

                </div>


                <div className="container-2">
                    <ThemeProvider theme={themeRed}>
                    <div style={{width:"90%", display:'flex', flexDirection:'column', alignItems:'center'}}>

                        {isLoading ?
                            <LinearProgress/> :
                            <Table auth={auth}
                                   language={language}
                                   selectedCategory={selectedCategory}
                                   docs={docs}
                                   headers={[t('Day'), t('Expenses'), t('Price'), t('Category')]}
                                   type={'outcomes'}
                                   categories={monthCategories}
                        />}

                        <QuickInput auth={auth}
                                    type={'outcomes'}
                                    categories={monthCategories}
                                    refreshData={fetchOutcomes}
                        />
                    </div>
                    </ThemeProvider>




                </div>

                <div className="menuContainer">
                    <Menu auth={auth} language={language}/>

                </div>
            </div>
        </div>

    );
}
export default OutcomePage;
