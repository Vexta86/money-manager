import React, {useState, useEffect, useContext} from "react";
import {Navigate, useLocation, useNavigate} from 'react-router-dom';

import {formatMoney, API_URL} from "../util";
import '../pages/styles.css';

import MainMenu from '../components/shared/mainMenu'
import {useTranslation} from "react-i18next";
import QuickInput from "../components/income-outcome/quickInput";
import Table from "../components/income-outcome/Table";

import {CircularProgress, Container, Icon, useTheme} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {themeRed} from "../config/ThemeMUI";
import {MyContext} from "../App";
import Box from "@mui/material/Box";



const Planner = () => {
    const {isOffline} = useContext(MyContext);

    const location = useLocation();
    const auth = location.state?.auth;
    const language = location.state?.language;


    const {t, i18n} = useTranslation();



    const [authenticated, setAuthenticated] = useState(!!auth); // Set authenticated based on token existence

    const [frequentCats, setFrequentCats] = useState([]);

    const navigate = useNavigate();

    const [monthlyDocs, setMonthlyDocs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);

    function fetchFrequents() {
        setIsLoading(true)
        fetch(`${API_URL}/frequent-outcomes`, {
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

                const price = data.docs?.reduce((acc, item) => {
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
            setTotal(categoriesAndPrice?.reduce((accumulator, product)=>{
                return accumulator + product.price;
            }, 0))

            setIsLoading(false)


        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    useEffect(() => {
        fetchFrequents();
        i18n.changeLanguage(language).then();

        if (!auth) {
            return; // No need to make API call if token doesn't exist
        }

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
                               headers={[t('Expenses'), t('Frequency'), t('Monthly Budget')]} refresh={fetchFrequents}/>
                    </div>


                )
            }) : null}
        </div>)
    }


    return (

            <ThemeProvider theme={themeRed}>
                <Container   sx={{ backgroundColor: themeRed.palette.primary.light, padding: '8% 4% 8% 4%', minHeight:'100vh', height: '100%', alignItems:'center'}}>


                    <h1>
                        <a onClick={() => {
                            navigate(-1)
                        }}>
                            <Icon>arrow_back</Icon>
                        </a>


                        {t('Monthly Budget')}
                    </h1>

                    <h3>Total = {formatMoney(total)}</h3>


                    <QuickInput auth={auth} categories={frequentCats} type={'frequent-outcomes'}
                                refreshData={fetchFrequents}/>



                            {isLoading ? <CircularProgress/> : <CategoryTables/>}




                </Container>
            </ThemeProvider>



    );
}
export default Planner;
