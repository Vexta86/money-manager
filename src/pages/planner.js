import React, {useState, useEffect} from "react";
import {Navigate, useLocation, useNavigate} from 'react-router-dom';

import {daysToMonths, formatMoney, localhost, TableRow, weeksToMonths, yearsToMonths, monthToFormat} from "../util";
import './styles.css';

import Menu from './menu'
import {useTranslation} from "react-i18next";

const QuickFrequentOutcome = ({auth}) => {

    const { t } = useTranslation();


    const [nameInput, setNameInput] = useState('');
    const [priceInput, setPriceInput] = useState(10000);
    const [categoryInput, setCategoryInput] = useState('');
    const [msg, setMsg] = useState('');

    const [frequencyInput, setFrequencyInput] = useState(1);
    const [frequencyScale, setFrequencyScale] = useState('Month');


    function FrequencySelector(){



        useEffect(() => {

        }, [frequencyInput, frequencyScale]);



        return(
            <div>
                <label htmlFor='frequency'>
                    {t('Frequency')}
                </label>

                <div className='filterContainer'>
                    <input
                        id="frequency"
                        className="inputDate"
                        type="number"
                        value={frequencyInput}
                        onChange={(e) => setFrequencyInput(e.target.value)}

                        min={1}
                        max={31}
                    />
                    <select id='frequencyOptions' className="inputDate"
                            onChange={e => setFrequencyScale(e.target.value)}
                            value={frequencyScale}>
                        <option value="Month">
                            {frequencyInput > 1 ? t('Months') : t('Month')}
                        </option>
                        <option value="Day">
                            {frequencyInput > 1 ? t('Days') : t('Day')}
                        </option>
                        <option value="Week">
                            {frequencyInput > 1 ? t('Weeks') : t('Week')}
                        </option>

                        <option value="Year">
                            {frequencyInput > 1 ? t('Years') : t('Year')}
                        </option>
                    </select>
                </div>


            </div>
        )
    }


    const newOutcome = async () => {
        let frequencyMonth;
        if(frequencyScale === 'Day'){
            frequencyMonth = (daysToMonths(frequencyInput));
        } else if(frequencyScale === 'Week'){
            frequencyMonth = (weeksToMonths(frequencyInput));
        } else if (frequencyScale === 'Year'){
            frequencyMonth = (yearsToMonths(frequencyInput));
        } else if (frequencyScale === 'Month'){
            frequencyMonth = (frequencyInput);
        }
        try {
            const response = await fetch(`http://${localhost}/frequent-outcomes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Authorization': auth,
                },
                body: JSON.stringify({
                    'name': nameInput ? nameInput : 'new outcome',
                    'category': categoryInput ? categoryInput : 'none',
                    'frequency': frequencyMonth ? frequencyMonth : 1,
                    'price': priceInput ? priceInput : 1
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
        <div className="quickContainer">

            <p className="pTable">{msg}</p>

            <div className="coolinput">
                <label htmlFor="name" className="text">Name:</label>
                <input type="text"
                       placeholder="Write here..."
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


            <FrequencySelector/>
            <div className="coolinput">
                <label htmlFor="category" className="text">{t('Category')}:</label>
                <input type="text"
                       placeholder={t("Write here...")}
                       name="category"
                       className="input"
                       value={categoryInput}
                       id="category"

                       onChange={(e) => setCategoryInput(e.target.value)}

                />
            </div>
            <button className="btn2" onClick={newOutcome}>
                {t("New Frequent Expense")}
            </button>

        </div>

    )
}

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

    const [month, setMonth] = useState(current_date.getMonth() + 1);
    const [year, setYear] = useState(current_date.getFullYear());

    const [monthlyDocs, setMonthlyDocs] = useState(null);


    useEffect(() => {
        i18n.changeLanguage(language);

        if (!auth) {
            return; // No need to make API call if token doesn't exist
        }

        fetch(`http://${localhost}/frequent-outcomes`, {
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
            console.log(monthlyDocs[0])






        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [auth, month, year, current_date.getMonth(), current_date.getFullYear(), QuickFrequentOutcome]);

    if (!authenticated) {
        return <Navigate to='/login' />;
    }
    return (
        <div>
            <div className="container">


                <h1>{t('Monthly Budget')}</h1>



                <div className='container-2'>

                    <div className="tableContainer">
                        <div className="table">
                            <TableRow elements={[ t('Name'), t('Frequency'),t('Monthly Price')]}/>



                            {monthlyDocs ? monthlyDocs.map((catItem) => {

                                const array = [ t('Category') + ' ' + catItem.category ,'Total  ' + formatMoney(catItem.price), ];

                                console.log(catItem)
                                const elementRows = catItem.elements[0].map(element => {

                                    let freq = monthToFormat(element.frequency)
                                    freq = freq[0] + ' ' + t(freq[1])

                                    const array = [ element.name, freq, formatMoney(element.price / element.frequency)];
                                    return <TableRow elements={array}
                                                     id={element._id}
                                                     auth={auth}
                                                     type={'frequent-outcomes'}
                                                     language={language}

                                    />
                                })

                                return [<TableRow elements={['']} id='space'/>,
                                    <TableRow elements={array}

                                              type={'frequent-outcomes'}
                                              language={language}/>,

                                    ...elementRows,
                                    ]


                            }) : null}
                            <TableRow elements={[ 'Total', monthlyDocs ? formatMoney(monthlyDocs.reduce((acc, item) => {
                                return acc + item.price;
                            }, 0)) : formatMoney(0)]}/>

                        </div>
                    </div>

                    <QuickFrequentOutcome auth={auth}/>

                </div>






                <div className="menuContainer">
                    <Menu auth={auth} language={language}/>


                </div>

            </div>

        </div>

    );
}
export default Planner;
