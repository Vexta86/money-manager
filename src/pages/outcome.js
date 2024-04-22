import React, {useState, useEffect} from "react";
import { Navigate, useLocation  } from 'react-router-dom';
import { formatMoney, TableRow, parseToDate, localhost} from "../util";

import Menu from './menu'
import {useTranslation} from "react-i18next";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";


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

            <div className="coolinput">
                <label htmlFor="name" className="text">{t("Name")}:</label>
                <input type="text"
                       placeholder={t("Name") + '...'}
                       name="name"
                       className="input"
                       value={nameInput}
                       id="name"

                       onChange={(e) => setNameInput(e.target.value)}

                />
            </div>

            <div className="coolinput">
                <label htmlFor="price" className="text">{t('Price')}: {formatMoney(priceInput)}</label>
                <input type="number"
                       placeholder="Write here..."
                       name="price"
                       className="input"
                       value={priceInput}
                       id="price"

                       onChange={(e) => setPriceInput(e.target.value)}

                />
            </div>


            <div className="coolinput">
                <label htmlFor="category" className="text">{t('Category')}:</label>
                <input type="text"
                       placeholder={t("Uncategorized") + '...'}
                       name="category"
                       className="input"
                       value={categoryInput}
                       id="category"

                       onChange={(e) => setCategoryInput(e.target.value)}

                />
            </div>
            <button className="btn2" onClick={newOutcome}>
                {t("New Expense")}
            </button>

        </div>

    )
}


const theme = createTheme({
    palette: {
        primary: {
            main: '#b50000',
            light: '#EEEEEE',
            dark: '#312222',
            contrastText: '#fff',
        }
    },

});

const OutcomePage = () => {

    // receives auth as a parameter when redirecting

    const location = useLocation();
    const auth = location.state?.auth;
    const language = location.state?.language;

    const {t, i18n} = useTranslation();


    const current_date = new Date();
    const [authenticated, setAuthenticated] = useState(!!auth); // Set authenticated based on token existence
    const [user, setUser] = useState("");

    const [docs, setDocs] = useState(null);

    const [month, setMonth] = useState(current_date.getMonth() + 1);
    const [year, setYear] = useState(current_date.getFullYear());

    const [monthCategories, setMonthCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [selectedDate, setSelectedDate] = useState(dayjs(current_date));

    function FilterMonth() {
        useEffect(() => {
            setMonth(selectedDate.month() + 1);
            setYear(selectedDate.year())
        }, []);
        return(
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label={t('Month') + '/' + t("Year")}
                                value={selectedDate}
                                views={['month', 'year']}
                                onChange={(newValue) => setSelectedDate(newValue)} />
                </LocalizationProvider>
            </ThemeProvider>
        )
    }


    function TableHeader() {
        let array = [ t('Day'), t('Name'), t('Price')]
        if (!selectedCategory){
            array.push(t('Category'))
        }
        return(<TableRow elements={array}/>)
    }


    useEffect(() => {
        i18n.changeLanguage(language).then();

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
    }, [auth, month, year, QuickOutcome]);

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
                    <FilterMonth/>

                    <div className="coolinput">
                        <label htmlFor="category" className="text">{t("Category")}:</label>
                        <select name="category"
                                className="input"
                                value={selectedCategory}
                                id="category"

                                onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {monthCategories.length > 1 || monthCategories.length === 0 ?
                                <option value="">
                                    {t("All categories")}
                                </option> : null}
                            {monthCategories ? monthCategories.map((item) => {
                                return <option value={item}>{item}</option>;
                            }) : null}
                        </select>
                    </div>

                </div>


                <div className="container-2">

                    <div className="tableContainer">
                        <div className="table">
                            <TableHeader/>

                            {docs ? docs.map((item) => {
                                let array = [item.date.slice(8, 10), item.name, formatMoney(item.price)];
                                if (!selectedCategory) {
                                    array.push(item.category)
                                }

                                if (selectedCategory === '' || item.category === selectedCategory) {

                                    return <TableRow elements={array}
                                                     id={item._id}
                                                     auth={auth}
                                                     type={'incomes'}
                                                     language={language}/>
                                } else {
                                    return null
                                }

                            }) : null}
                            <TableRow elements={['Total', docs ? formatMoney(docs.reduce((acc, item) => {
                                if (selectedCategory !== '' && selectedCategory === item.category) {
                                    return acc + item.price;
                                } else if (selectedCategory === '') {
                                    return acc + item.price;
                                } else {
                                    return acc; //
                                }
                            }, 0)) : null]}/>

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
