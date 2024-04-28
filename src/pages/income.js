import React, {useEffect, useState} from "react";
import {Navigate, useLocation} from 'react-router-dom';
import './styles.css';
import {localhost, parseToDate} from "../util";
import QuickInput from "../modules/quickInput";
import Table from "../modules/Table";

import Menu from './menu'
import {useTranslation} from "react-i18next";


import dayjs from "dayjs";
import FilterCategory from "../modules/FilterCategory";
import FilterMonth from "../modules/FilterMonth";



const IncomePage = () => {

    // receives auth as a parameter when redirecting

    const location = useLocation();
    const auth = location.state?.auth;
    const language = location.state?.language;

    const {t, i18n} = useTranslation();


    const current_date = new Date();
    const [authenticated, setAuthenticated] = useState(!!auth); // Set authenticated based on token existence


    const [docs, setDocs] = useState(null);

    const [month, setMonth] = useState(current_date.getMonth() + 1);
    const [year, setYear] = useState(current_date.getFullYear());

    const [selectedDate, setSelectedDate] = useState(dayjs(current_date));


    const [monthCategories, setMonthCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');


    async function changeSelectedDate(date) {
        setSelectedDate(date);
        const selectedMonth = date.month() + 1;
        const selectedYear = date.year();
        setMonth(selectedMonth);
        setYear(selectedYear);

    }

    async function changeCategory(newCategory) {

        setSelectedCategory(newCategory);
    }





    useEffect(() => {
        i18n.changeLanguage(language).then();
        if (!auth) {
            return; // No need to make API call if token doesn't exist
        }
       
        setSelectedCategory('')
        fetch(`${localhost}/incomes?month=${month}&year=${year}`, {
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



            const orderedDocs = data.docs.sort((a,b)=>{
                return b.date.localeCompare(a.date);
            })
            setDocs(orderedDocs)
            
            const uniqueCategories = new Set(data.docs.map(i => i.category));
            const uniqueCategoryArray = Array.from(uniqueCategories);
            setMonthCategories(uniqueCategoryArray);



        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [auth,  month, year]);

    if (!authenticated) {
        return <Navigate to='/money-manager/login' />;
    }
    return (
        <div >
            <div className="container">

                <h1>{t("Income in")} { parseToDate(month.toString() + '-' + year.toString(), language) }</h1>


                <div className="filterContainer">

                    <FilterMonth selectedDate={selectedDate}
                                 changeDate={changeSelectedDate}/>

                    <FilterCategory selectedCategory={selectedCategory}
                                    changeCategory={changeCategory}
                                    monthCategories={monthCategories}    />






                </div>


                <div className="container-2">


                    <Table auth={auth}
                           language={language}
                           selectedCategory={selectedCategory}
                           docs={docs}
                           headers={[t('Day'), t('Name'), t('Price'), t('Category')]}
                           type={'incomes'}
                            categories={monthCategories}
                    />

                    <QuickInput auth={auth}
                                type={'incomes'}
                                categories={monthCategories}
                    />

                </div>
                
                <div className="menuContainer">
                    <Menu auth={auth} language={language}/>
                </div>
            </div>
        </div>
        
    );
}
export default IncomePage;
