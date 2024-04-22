import React, {useState, useEffect} from "react";
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import './styles.css';
import {formatMoney, localhost, daysToMonths, weeksToMonths, yearsToMonths, monthToFormat} from "../util";
import {useTranslation} from "react-i18next";


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { ThemeProvider, createTheme } from '@mui/material/styles';



const theme = createTheme({
    palette: {
        primary: {
            main: '#00ADB5',
            light: '#EEEEEE',
            dark: '#222831',
            contrastText: '#fff',
        }
    },

});

const themeRed = createTheme({
    palette: {

        primary: {
            main: '#b50000',
            light: '#EEEEEE',
            dark: '#312222',
            contrastText: '#fff',
        }
    },

});

const EditPage = () => {

    // receives auth as a parameter when redirecting

    const location = useLocation();
    const auth = location.state?.auth;
    const language = location.state?.language;

    const { t, i18n } = useTranslation();


    const elementID = location.state?.id;
    const type = location.state?.type;
    const isFrequent = type.includes('frequent');

    const navigate = useNavigate();


    const [authenticated, setAuthenticated] = useState(!!auth); // Set authenticated based on token existence


    const [frequencyInput, setFrequencyInput] = useState(1);
    const [frequencyScale, setFrequencyScale] = useState('Month');

    const [nameInput, setNameInput] = useState('');
    const [priceInput, setPriceInput] = useState(10000);
    const [categoryInput, setCategoryInput] = useState('');
    const [msg, setMsg] = useState('');

    const [selectedDate, setSelectedDate] = useState();



    function AdvanceDateSelector(){

        return(
            <ThemeProvider theme={type.includes('incomes') ? theme : themeRed}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label={t('Date')}
                                value={selectedDate}
                                views={['day', 'month']}

                                onChange={(newValue) => setSelectedDate(newValue)} />
                </LocalizationProvider>
            </ThemeProvider>

        )
    }

    function onDelete(){
        const confirmed = window.confirm(t('Are you sure you want to delete this item?'));

        if (confirmed){
            fetch(`http://${localhost}/${type}/${elementID}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Authorization': auth,
                },
            }).then(navigate(-1))
        }


    }

    function onSave() {
        const newData = [
            {
                "propName": "name",
                "value": nameInput ? nameInput : "Name changed"
            },
            {
                "propName": "price",
                "value": priceInput ? priceInput.toString() : "0"
            },

            {
                "propName": "category",
                "value": categoryInput ? categoryInput : "none"
            },
        ]
        if (isFrequent){

            let frequencyMonth;

            if(frequencyScale.includes('Day')){


                frequencyMonth = (daysToMonths(frequencyInput));

            } else if(frequencyScale.includes('Week')){


                frequencyMonth = (weeksToMonths(frequencyInput));

            } else if (frequencyScale.includes('Year')){

                frequencyMonth = (yearsToMonths(frequencyInput));

            } else if (frequencyScale.includes('Month')){

                frequencyMonth = (frequencyInput);

            }

            newData.push({
                "propName": "frequency",
                "value": frequencyMonth ? frequencyMonth : 1
            })
        }else {

            newData.push({
                "propName": "date",
                "value": selectedDate
            })
        }


        fetch(`http://${localhost}/${type}/${elementID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': auth,
            },
            body: JSON.stringify(newData)
        }).then(res=> {
            if (res.ok){
                alert(t('Changes saved successfully'));
                navigate(-1);
            }
            else {
                setMsg('Somethingw went wrong')
            }
        })

    }

    function FrequencySelector(){


        return(
            <div>
                <p>
                    {t("Frequency")}
                </p>

                <div className='filterContainer'>
                    <input
                        id="frequency"
                        className="inputDate"
                        type="number"
                        value={frequencyInput}
                        onChange={(e) => setFrequencyInput(e.target.value) }

                        min={1}

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

    useEffect(() => {
        i18n.changeLanguage(language)

        if (!auth) {
            return; // No need to make API call if token doesn't exist
        }

        fetch(`http://${localhost}/${type}/${elementID}`, {
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



            setPriceInput(data.price);
            setCategoryInput(data.category);
            setNameInput(data.name)

            if (isFrequent) {
                const ogFrequency = monthToFormat(data.frequency, language);
                setFrequencyInput(ogFrequency[0]);
                setFrequencyScale(ogFrequency[1]);
            } else {

                setSelectedDate(dayjs(data.date))


            }


        }).catch(error => {
            setMsg('Error fetching data:', error);
        });
    }, [auth, elementID, i18n, isFrequent, language, type]);

    if (!authenticated) {
        return <Navigate to='/login'/>;
    }
    return (
        <div>
            <div className={type.includes('incomes') ? 'container' : 'container-red'}>
                <h1>
                    {t("Editing")} {nameInput}
                </h1>

                <p>{msg}</p>


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


                {isFrequent ? <FrequencySelector/> : <AdvanceDateSelector/>}


                <div className="coolinput">
                    <label htmlFor="price" className="text">{t('Price')}: {formatMoney(priceInput)}</label>
                    <input type="number"
                           placeholder={t("Write here...")}
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
                           placeholder={t("Write here...")}
                           name="category"
                           className="input"
                           value={categoryInput}
                           id="category"

                           onChange={(e) => setCategoryInput(e.target.value)}

                    />
                </div>


                <div className='options'>
                    <button className="btn2" onClick={() => {
                        navigate(-1)
                    }}>
                        {t("Cancel")}
                    </button>
                    <button className="btn-red" onClick={onDelete}>
                        {t("Delete")}
                    </button>
                    <button className="btn2" onClick={onSave}>
                        {t("Save")}
                    </button>

                </div>


            </div>
        </div>

    );
}
export default EditPage;
