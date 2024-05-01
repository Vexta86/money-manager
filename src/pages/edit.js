import React, {useState, useEffect} from "react";
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import './styles.css';
import {formatMoney, localhost, daysToMonths, weeksToMonths, yearsToMonths, monthToFormat} from "../util";
import {useTranslation} from "react-i18next";


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { ThemeProvider } from '@mui/material/styles';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import {Button, CircularProgress} from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import {theme} from "../config/ThemeMUI";
import Alert from "@mui/material/Alert";
import FrequencySelector from "../modules/FrequencySelector";
import OnlineChecker from "../modules/OnlineChecker";




const EditPage = () => {

    // receives auth as a parameter when redirecting

    const location = useLocation();
    const auth = location.state?.auth;
    const language = location.state?.language;
    const categories = location.state?.categories;

    const { t, i18n } = useTranslation();


    const elementID = location.state?.id;
    const type = location.state?.type;
    const isFrequent = type.includes('frequent');

    const navigate = useNavigate();


    const [authenticated, setAuthenticated] = useState(auth); // Set authenticated based on token existence




    const [nameInput, setNameInput] = useState('');
    const [priceInput, setPriceInput] = useState(10000);
    const [categoryInput, setCategoryInput] = useState('');
    const [msg, setMsg] = useState('');

    const [selectedDate, setSelectedDate] = useState();

    const [frequencyInput, setFrequencyInput] = useState(1);
    const [frequencyScale, setFrequencyScale] = useState('Month');

    const [isLoading, setIsLoading] = useState(true);
    function changeFrequencyInput(newInput){
        setFrequencyInput(newInput);
    }
    function changeFrequencyScale(newFrequency){
        setFrequencyScale(newFrequency);
    }

    function AdvanceDateSelector(){

        return(

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label={t('Date')}
                                value={selectedDate}
                                views={['day', 'month']}

                                onChange={(newValue) => setSelectedDate(dayjs(newValue))} />
                </LocalizationProvider>


        )
    }

    function onDelete(){
        const confirmed = window.confirm(t('Are you sure you want to delete this item?'));

        if (confirmed){
            fetch(`${localhost}/${type}/${elementID}`,{
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
                "value": nameInput
            },
            {
                "propName": "price",
                "value": priceInput
            },

            {
                "propName": "category",
                "value": categoryInput
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



        fetch(`${localhost}/${type}/${elementID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': auth,
            },
            body: JSON.stringify(newData)
        }).then(res=> {
            if (res.ok){
                setMsg('Successful')
                alert(t('Changes saved successfully'));
                navigate(-1);
            }
            else {
                setMsg('Something went wrong')
            }
        })

    }


    useEffect(() => {
        i18n.changeLanguage(language).then();

        if (!auth) {
            return; // No need to make API call if token doesn't exist
        }
        setIsLoading(true)
        fetch(`${localhost}/${type}/${elementID}`, {
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

            setIsLoading(false)
        }).catch(error => {
            setMsg('Error fetching data:', error);
            setIsLoading(false);

        });

    }, []);

    if (!authenticated) {
        return <Navigate to='/money-manager/login'/>;
    }



    return (
        <div>
            <div className={'container'}>
                <h1>
                    {t("Editing")} {nameInput}
                </h1>
                <OnlineChecker/>


                <ThemeProvider theme={theme}>

                    {isLoading ?
                        <CircularProgress/> :
                        <div className={'container'}>
                            <Box
                                component="form"
                                sx={{
                                    '& .MuiTextField-root': {m: 1, width: '25ch'},
                                    'display': 'flex',
                                    'flexDirection': 'column'
                                }}
                                noValidate
                                autoComplete="off"
                            >
                            <TextField id="name"
                                       type="text"
                                       error={!nameInput}
                                       label={t("Name")}
                                       variant="outlined"
                                       value={nameInput}
                                       onChange={(e) => setNameInput(e.target.value)}

                            />
                            {isFrequent ?
                                <FrequencySelector frequencyScale={frequencyScale} frequencyInput={frequencyInput}
                                                   changeFrequencyScale={changeFrequencyScale}
                                                   changeFrequencyInput={changeFrequencyInput}/> :
                                <AdvanceDateSelector/>}

                            <TextField id="price"
                                       type="number"
                                       label={t("Price") + ' ' + formatMoney(priceInput)}
                                       variant="outlined"
                                       value={priceInput}
                                       error={!priceInput}
                                       onChange={(e) => setPriceInput(e.target.value)}

                            />

                            <Autocomplete
                                freeSolo
                                disablePortal
                                id="category"
                                options={categories}
                                value={categoryInput}

                                onChange={(e, newValue) => setCategoryInput(newValue)}
                                renderInput={(params) =>
                                    <TextField onChange={(e) => setCategoryInput(e.target.value)} {...params}
                                               label="Category" error={!categoryInput}/>}
                            />
                            </Box>

                                <ButtonGroup variant="contained" aria-label="Basic button group">
                                    <Button onClick={() => navigate(-1)}>{t("Cancel")}</Button>
                                    <Button onClick={onDelete} color='error'>️{t("Delete")}</Button>
                                    <Button onClick={onSave} color='success'>{t("Save")}</Button>

                                </ButtonGroup>
                        </div>}

                    {msg ? <Alert severity={msg.includes('successful') ? "success" : "error"}>{t(msg)}</Alert> : null}

                </ThemeProvider>


            </div>
        </div>

    );
}


export default EditPage;
