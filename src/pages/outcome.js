import React, {useState, useEffect} from "react";
import { Navigate, useLocation  } from 'react-router-dom';
import { formatMoney, TableRow, parseToDate, localhost} from "../util";

import Menu from './menu'
import {useTranslation} from "react-i18next";


const QuickOutcome = ({auth}) => {

    const { t } = useTranslation();


    const [nameInput, setNameInput] = useState('');
    const [priceInput, setPriceInput] = useState(10000);
    const [categoryInput, setCategoryInput] = useState('');
    const [msg, setMsg] = useState('');

    const newOutcome = async () => {
        try {
            const response = await fetch(`http://${localhost}/outcomes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Authorization': auth,
                },
                body: JSON.stringify({
                    'name': nameInput ? nameInput : 'new outcome',
                    'category': categoryInput ? categoryInput : 'none',
                    'price': priceInput
                })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setMsg(data.message);
            window.location.reload();
        } catch (error) {
            console.error('Error fetching data:', error);
            setMsg('Error occurred while fetching data');
        }
    };

    return(
        <div className="quickContainer" >

            <p className="pTable">{msg}</p>

            <input
                value={nameInput}
                id="name"
                className="quickInput"
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={t("Name")}
            />
            <label for="price">{formatMoney(priceInput)}</label>
             <input
                value={priceInput}
                id="price"
                className="quickInput"
                type="number"
                onChange={(e) => e.target.value >= 0 ? setPriceInput(e.target.value): null}

                placeholder={formatMoney(priceInput)}
            /> 
            <input
                value={categoryInput}
                id="category"
                className="quickInput"
                onChange={(e) => setCategoryInput(e.target.value)}
                placeholder={t("Uncategorized")}
            />
            <button className="btn2" onClick={newOutcome}>
                {t("New Expense")}
            </button>

        </div>    

    )
}



const OutcomePage = () => {

    // receives auth as a parameter when redirecting

    const location = useLocation();
    const auth = location.state?.auth;
    const language = location.state?.language;

    const { t, i18n } = useTranslation();


    const current_date = new Date();
    const [authenticated, setAuthenticated] = useState(!!auth); // Set authenticated based on token existence
    const [user, setUser] = useState("");

    const [docs, setDocs] = useState(null);

    const [month, setMonth] = useState(current_date.getMonth() + 1);
    const [year, setYear] = useState(current_date.getFullYear());

    const [monthCategories, setMonthCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');


    function onSelectCategory(category) {
        console.log(category);
        setSelectedCategory(category);
    }

    useEffect(() => {
        i18n.changeLanguage(language);

        if (!auth) {
            return; // No need to make API call if token doesn't exist
        }
       
        setSelectedCategory('')
        fetch(`http://${localhost}/outcomes?month=${month}&year=${year}`, {
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
                return b.date.localeCompare(a.date);
            })
            setDocs(orderedDocs)
            
            const uniqueCategories = new Set(data.docs.map(i => i.category));
            const uniqueCategoryArray = Array.from(uniqueCategories);
            setMonthCategories(uniqueCategoryArray);
            


        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [auth, month, year, current_date.getMonth(), current_date.getFullYear(), QuickOutcome]);

    if (!authenticated) {
        return <Navigate to='/login' />;
    }
    return (
        <div >
            <div className="container-red">

                <h1>
                    {t("Expenses in")} { parseToDate(month.toString() + '-' + year.toString(), language) }
                </h1>

                <div className="filterContainer">


                    <div className='tag-input'>
                        <label htmlFor='filterMonth'>
                            {t("Month")}
                        </label>

                        <input
                            id="filterMonth"
                            className="inputDate"
                            type="number"
                            value={month}
                            onChange={(e) => e.target.value > -1 && e.target.value <= 12 ? setMonth(e.target.value) : null}

                            min={1}
                            max={12}
                        />

                    </div>


                    <div className='tag-input'>
                        <label htmlFor='filterYear'>
                            {t("Year")}
                        </label>
                        <input
                            id="filterYear"
                            className="inputDate"
                            type="number"
                            value={year}
                            onChange={(e) => e.target.value >= 9 && e.target.value <= 2999 ? setYear(e.target.value) : null}
                            min={2023}
                            max={2999}
                        />
                    </div>


                    <div className='tag-input'>
                        <label htmlFor='cats'>
                            {t("Category")}
                        </label>

                        <select id="cats" className="inputDate" onChange={(e) => onSelectCategory(e.target.value)}>
                            {monthCategories.length > 1 || monthCategories.length == 0 ?
                                <option value="">
                                    {t("All categories")}
                                </option> : null}
                            {monthCategories ? monthCategories.map((item) => {
                                return <option key={item} value={item}>{item}</option>;
                            }) : null}
                        </select>

                    </div>

                </div>



                <div className="container-2">

                    <div className="tableContainer">
                            <div className="table">
                                <TableRow elements={[t('Category'), t('Day'), t('Name'), t('Price')]}/>
                                {docs ? docs.map(( item) => {
                                    const array = [item.category, item.date.slice(8, 10), item.name, formatMoney(item.price)];


                                    if (selectedCategory === '' || item.category === selectedCategory){
                                        return <TableRow elements={array}
                                                         id={item._id}
                                                         auth={auth}
                                                         type={'outcomes'}
                                                         language={language}/>;
                                    }

                                }): null}
                                <TableRow elements={['Total',docs ? formatMoney(docs.reduce((acc, item) => {
                                    if (selectedCategory !== '' && selectedCategory === item.category) {
                                        return acc + item.price;
                                    } else if (selectedCategory === '') {
                                        return acc + item.price;
                                    } else {
                                        return acc; //
                                    }
                                }, 0)) : null ]}/>


                            </div>
                        </div>
                    

                    <QuickOutcome auth={auth}/>
                    
                </div>
                
                <div className="menuContainer">
                    <Menu auth={auth} language={language}/>

                </div>
            </div>
        </div>
        
    );
}
export default OutcomePage;
