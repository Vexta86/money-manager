import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {daysToMonths, formatMoney, localhost, weeksToMonths, yearsToMonths} from "../util";
import TextField from '@mui/material/TextField';

import Autocomplete from '@mui/material/Autocomplete';
import {Button} from "@mui/material";
import {theme, themeRed} from "../config/ThemeMUI";
import {ThemeProvider} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import FrequencySelector from "./FrequencySelector";
import OnlineChecker from "./OnlineChecker";
import dayjs from "dayjs";

const QuickInput = ({   auth: auth,
                        type: type,
                        categories: categories,
                        refreshData: refreshData
                        }) =>{

    const [nameInput, setNameInput] = useState('');
    const [priceInput, setPriceInput] = useState(10000);
    const [categoryInput, setCategoryInput] = useState('');
    const [msg, setMsg] = useState('');

    const { t } = useTranslation();
    const current_date = new Date();


    const [frequencyInput, setFrequencyInput] = useState(1);
    const [frequencyScale, setFrequencyScale] = useState('Month');
    function changeFrequencyInput(newInput){
        setFrequencyInput(newInput);
    }
    function changeFrequencyScale(newFrequency){
        setFrequencyScale(newFrequency);
    }
    const newFrequent = async () => {
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

        fetch(`${localhost}/frequent-outcomes`,{
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
                        'price': priceInput ? priceInput : 1,

                    })
        }).then(res => {
            console.log(res)
            if(!res.ok){
                setMsg('Network response was not ok');
            } else if(res.offline){
                setMsg('Saved offline')
            } else {
                setMsg('Successful');

                refreshData();
            }
        }).catch(err => {
            console.error(err);
            setMsg('Something went wrong');
        })

    };
    const newIncome = async () => {
        fetch(`${localhost}/${type}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Authorization': auth,
                    },
                    body: JSON.stringify({
                        'name': nameInput ? nameInput : type.includes('income') ? t("New Income") : t('New Expense'),
                        'category': categoryInput ? categoryInput : 'none',
                        'price': priceInput,

                    })
                }).then(res=>{

                    if(!res.ok){
                        console.error('Network response was not ok', res);
                        setMsg('Network response was not ok');
                    } else {
                        setMsg('Successful');

                        refreshData();


                    }
                    return res.json()


        }).then(jsonD =>{
            if (jsonD.offline){
                setMsg('Saved Offline')
            }
            console.log(jsonD)
            }

        ).catch(err => {
            console.error(err);
            setMsg('Something went wrong');
        });

    };
    useEffect(() => {
        refreshData();
        setMsg('')
    }, []);

    return(
        <div className={"quickContainer"}>



            <ThemeProvider theme={type.includes('income') ? theme : themeRed}>
                <OnlineChecker/>
                {msg ? <Alert severity={msg.includes('Successful') ? "success" : "error"}>{t(msg)}</Alert> : null}
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                        'display': 'flex',
                        'flexDirection':'column'
                    }}
                    noValidate
                    autoComplete="off"
                >

                    <TextField id="name"
                               type="text"

                               label={t(`New ${type.includes('outcomes') ? 'Expense' : 'Income'}`)}
                               variant="outlined"
                               value={nameInput}
                               onChange={(e) => setNameInput(e.target.value)}

                    />
                    <TextField id="price"
                               type="number"
                               label={t("Price") + ' ' + formatMoney(priceInput)}
                               variant="outlined"
                               value={priceInput}
                               error={!priceInput}

                               onChange={(e) => setPriceInput(e.target.value)}

                    />

                    {type.includes('frequent') ? <FrequencySelector changeFrequencyInput={changeFrequencyInput} changeFrequencyScale={changeFrequencyScale} frequencyInput={frequencyInput} frequencyScale={frequencyScale}/> : null}

                    <Autocomplete
                        freeSolo
                        disablePortal
                        id="category"
                        options={categories}
                        value={categoryInput}

                        onChange={(e, value) => setCategoryInput(value)}
                        renderInput={(params) => <TextField {...params} onChange={e => {setCategoryInput(e.target.value)}} label={t("Category")} />}
                    />


                    <Button variant="contained"

                            onClick={type.includes('frequent') ? newFrequent : newIncome }
                    >
                        {type.includes('income') ? t("New Income") : t('New Expense')}
                    </Button>

                </Box>


            </ThemeProvider>








        </div>

    )
}

export default QuickInput;