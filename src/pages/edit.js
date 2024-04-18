import React, {useState, useEffect} from "react";
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import './styles.css';
import {formatMoney, parseToDate, localhost, daysToMonths, weeksToMonths, yearsToMonths, monthToFormat} from "../util";
import {useTranslation} from "react-i18next";



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


    const current_date = new Date();
    const [authenticated, setAuthenticated] = useState(!!auth); // Set authenticated based on token existence

    const [data, setData] = useState(null);

    const [day, setDay] = useState('')
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [frequencyInput, setFrequencyInput] = useState(1);
    const [frequencyScale, setFrequencyScale] = useState('Month');

    const [nameInput, setNameInput] = useState('');
    const [priceInput, setPriceInput] = useState(10000);
    const [categoryInput, setCategoryInput] = useState('');
    const [msg, setMsg] = useState('');

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
            }).then(res => {
                navigate(-1)
            })
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
            const date = `${year}-${month}-${day}`;
            newData.push({
                "propName": "date",
                "value": date
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
    function DateSelector(){
        return(
            <div>
                <p>
                    {t("Date")}: {parseToDate(day.toString() + '-' + month.toString() + '-' + year.toString(), language)}
                </p>
                <div className="filterContainer">


                    <div className='tag-input'>
                        <label htmlFor="day">
                            {t("Day")}
                        </label>

                        <input
                            id="day"
                            className="inputDate"
                            type="number"
                            value={day}
                            onChange={(e) => e.target.value > -1 && e.target.value <= 31 ? setDay(e.target.value) : null}

                            min={1}
                            max={31}
                        />

                    </div>
                    <div className='tag-input'>
                        <label htmlFor="month">
                            {t("Month")}
                        </label>
                        <input
                            id="month"
                            className="inputDate"
                            type="number"
                            value={month}
                            onChange={(e) => e.target.value > -1 && e.target.value <= 12 ? setMonth(e.target.value) : null}

                            min={1}
                            max={12}
                        />

                    </div>
                    <div className='tag-input'>
                        <label htmlFor="year">
                            {t("Year")}
                        </label>
                        <input
                            id="year"
                            className="inputDate"
                            type="number"
                            value={year}
                            onChange={(e) => e.target.value >= 9 && e.target.value <= 2999 ? setYear(e.target.value) : null}
                            min={2023}
                            max={2999}
                        />
                    </div>


                    <button className='btn2' onClick={() => {
                        setDay(current_date.getDate());
                        setMonth(current_date.getMonth() + 1)
                        setYear(current_date.getFullYear())
                    }}>
                        {t("Today")}
                    </button>


                </div>
            </div>
        )
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


            setData(data)

            setPriceInput(data.price);
            setCategoryInput(data.category);
            setNameInput(data.name)

            if (isFrequent) {
                const ogFrequency = monthToFormat(data.frequency, language);
                setFrequencyInput(ogFrequency[0]);
                setFrequencyScale(ogFrequency[1]);
            } else {
                setYear(data.date.slice(0, 4))

                setMonth(data.date.slice(5, 7))

                setDay(data.date.slice(8, 10))

            }


        }).catch(error => {
            setMsg('Error fetching data:', error);
        });
    }, [auth]);

    if (!authenticated) {
        return <Navigate to='/login'/>;
    }
    return (
        <div>
            <div className={elementID.includes('incomes') ? 'container' : 'container-red'}>
                <h1>
                    {t("Editing")} {nameInput}
                </h1>

                <p>{msg}</p>
                <label htmlFor="name">
                    {t("Name")}
                </label>

                <input
                    value={nameInput}
                    id="name"
                    className="quickInput"
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={t("Name")}
                />
                { isFrequent ?<FrequencySelector/> :<DateSelector/>}

                <label htmlFor="price">{formatMoney(priceInput)}</label>
                <input
                    value={priceInput}
                    id="price"
                    className="quickInput"
                    type="number"
                    onChange={(e) => e.target.value >= 0 ? setPriceInput(e.target.value) : null}

                    placeholder={formatMoney(priceInput)}
                />
                <label htmlFor="category">
                    {t("Category")}
                </label>

                <input
                    value={categoryInput}
                    id="category"
                    className="quickInput"
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder={categoryInput}
                />

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
