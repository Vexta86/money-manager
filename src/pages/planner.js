import React, {useState, useEffect} from "react";
import {Navigate, useLocation} from 'react-router-dom';

import { localhost} from "../util";
import './styles.css';

import Menu from './menu'
import {useTranslation} from "react-i18next";
import QuickInput from "../modules/quickInput";
import Table from "../modules/Table";

import {CircularProgress} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {themeRed} from "../config/ThemeMUI";



const Planner = () => {


    const location = useLocation();
    const auth = location.state?.auth;
    const language = location.state?.language;


    const {t, i18n} = useTranslation();



    const [authenticated, setAuthenticated] = useState(!!auth); // Set authenticated based on token existence

    const [frequentCats, setFrequentCats] = useState([]);



    const [monthlyDocs, setMonthlyDocs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    function fetchFrequents() {
        setIsLoading(true)
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


                return  {
                    '_id': i.slice(0,3),
                    'category': i,
                    'price': price,
                    'elements': Array(elements.filter(element => element !== undefined))
                };
            });


            setMonthlyDocs(categoriesAndPrice);
            setIsLoading(false)


        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    useEffect(() => {
        i18n.changeLanguage(language).then();

        if (!auth) {
            return; // No need to make API call if token doesn't exist
        }

    }, [auth]);

    useEffect(() => {
        fetchFrequents();
    }, []);

    if (!authenticated) {
        return <Navigate to='/money-manager/login' />;
    }

    function CategoryTables(){
        return (<div style={{alignItems:"center", width:"100%"}}>
            {monthlyDocs ? monthlyDocs.map((cat) => {
                return (
                    <div style={{width:"100%"}} key={cat.category}>
                        <h2>{t('Category')} {cat.category}</h2>
                        <Table auth={auth} categories={frequentCats} selectedCategory={cat.category}
                               type={'frequent-outcomes'} docs={cat.elements[0]} language={language}
                               headers={[t('Expenses'), t('Frequency'), t('Monthly Budget')]}/>
                    </div>


                )
            }) : null}
        </div>)
    }

    return (
        <div>
            <ThemeProvider theme={themeRed}>
            <div className="container-red">


                <h1>{t('Monthly Budget')}</h1>


                <div className='container-2'>

                        <div className='frequent-container'>
                            {isLoading ? <CircularProgress/> : <CategoryTables/>}
                        </div>




                    <QuickInput auth={auth} categories={frequentCats} type={'frequent-outcomes'}
                                refreshData={fetchFrequents}/>

                </div>


                <div className="menuContainer">
                    <Menu auth={auth} language={language}/>


                </div>

            </div>
            </ThemeProvider>
        </div>

    );
}
export default Planner;
