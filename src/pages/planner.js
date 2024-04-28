import React, {useState, useEffect} from "react";
import {Navigate, useLocation, useNavigate} from 'react-router-dom';

import {daysToMonths, formatMoney, localhost, TableRow, weeksToMonths, yearsToMonths, monthToFormat} from "../util";
import './styles.css';

import Menu from './menu'
import {useTranslation} from "react-i18next";
import QuickInput from "../modules/quickInput";
import Table from "../modules/Table";
import Box from "@mui/material/Box";



const Planner = () => {


    const location = useLocation();
    const auth = location.state?.auth;
    const language = location.state?.language;
    const navigate = useNavigate();

    const {t, i18n} = useTranslation();


    const current_date = new Date();
    const [authenticated, setAuthenticated] = useState(!!auth); // Set authenticated based on token existence
    const [user, setUser] = useState("");
    const [docs, setDocs] = useState(null);
    const [frequentCats, setFrequentCats] = useState([]);

    const [month, setMonth] = useState(current_date.getMonth() + 1);
    const [year, setYear] = useState(current_date.getFullYear());

    const [monthlyDocs, setMonthlyDocs] = useState(null);


    useEffect(() => {
        i18n.changeLanguage(language);

        if (!auth) {
            return; // No need to make API call if token doesn't exist
        }

        fetch(`${localhost}/frequent-outcomes`, {
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

            setUser(data.userData.email.email);

            const orderedDocs = data.docs.sort((a,b)=>{
                return b.category.localeCompare(a.category);
            })
            setDocs(orderedDocs)




            const uniqueCategoryArray = Array.from(new Set(data.docs.map(i => i.category)));
            setFrequentCats(uniqueCategoryArray)


            const categoriesAndPrice =  uniqueCategoryArray.map(i => {



                const price = data.docs.reduce((acc, item) => {
                    if (item.category === i) {
                        return acc + (Math.round((item.price/item.frequency) * 10) / 10);
                    } else {
                        return acc;
                    }
                }, 0)

                const elements = data.docs.map((item) => {
                    if (item.category === i) {
                        return item;
                    }
                })

                const object = {
                    '_id': i.slice(0,3),
                    'category': i,
                    'price': price,
                    'elements': Array(elements.filter(element => element !== undefined))
                }
                return object;
            });




            setMonthlyDocs(categoriesAndPrice);







        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [auth, month, year, current_date.getMonth(), current_date.getFullYear()]);

    if (!authenticated) {
        return <Navigate to='/money-manager/login' />;
    }
    return (
        <div>
            <div className="container">


                <h1>{t('Monthly Budget')}</h1>



                <div className='container-2'>

                    <div className='tableContainer'>
                        {monthlyDocs ? monthlyDocs.map((cat)=>{
                            return(
                                <div>
                                    <h2>{t('Category')} {cat.category}</h2>
                                    <Table auth={auth} categories={frequentCats} selectedCategory={cat.category}
                                           type={'frequent-outcomes'} docs={cat.elements[0]} language={language}
                                           headers={[t('Name'), t('Frequency'), t('Price')]}/>
                                </div>


                            )
                        }) : null}
                    </div>


                    <QuickInput auth={auth} categories={frequentCats} type={'frequent-outcomes'}/>

                </div>


                <div className="menuContainer">
                    <Menu auth={auth} language={language}/>


                </div>

            </div>

        </div>

    );
}
export default Planner;
