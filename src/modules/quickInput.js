import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {daysToMonths, formatMoney, localhost, weeksToMonths, yearsToMonths} from "../util";
import TextField from '@mui/material/TextField';

import Autocomplete from '@mui/material/Autocomplete';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Icon, Typography} from "@mui/material";
import {theme, themeRed} from "../config/ThemeMUI";
import {ThemeProvider} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import FrequencySelector from "./FrequencySelector";
import OnlineChecker from "./OnlineChecker";
import dayjs from "dayjs";
import {MyContext} from "../App";


import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

const QuickInput = ({   auth: auth,
                        type: type,
                        categories: categories,
                        refreshData: refreshData
                        }) =>{

    const { t } = useTranslation();
    const current_date = new Date();

    const {isOffline} = useContext(MyContext);
    const [nameInput, setNameInput] = useState('');

    const [priceInput, setPriceInput] = useState(0);
    const [categoryInput, setCategoryInput] = useState('');

    const [dateInput, setDateInput] = useState(current_date)

    const [msg, setMsg] = useState('');




    const [ open, setOpen ] = useState(false)
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
                        'price': priceInput ? priceInput : 1,
                        'date': dateInput, //TODO Add date option

                    })
                }).then(res=>{

                    if(!res.ok){
                        console.error('Network response was not ok', res);
                        setMsg('Network response was not ok');
                    } else {
                        setMsg('Successful');

                        refreshData();

                        setDateInput(current_date)

                    }
                    return res.json()


        }).then(jsonD =>{
            if (jsonD.offline){
                setMsg('Saved Offline')
            }

        }

        ).catch(err => {
            console.error(err);
            setMsg('Something went wrong');
        });

    };


    return(
        <div >



            <ThemeProvider theme={type.includes('income') ? theme : themeRed}>



                <Fab variant="extended" color="primary" aria-label="add" onClick={()=>setOpen(true)}>
                    <Icon>add</Icon>
                    {t(`New ${type.includes('outcomes') ? 'Expense' : 'Income'}`)}
                </Fab>

                <Dialog open={open} onClose={()=>setOpen(false)}>

                    <DialogTitle id="quick-input-title">
                        <b>
                            {t(`New ${type.includes('outcomes') ? 'Expense' : 'Income'}`)}
                        </b>
                    </DialogTitle>


                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                            'display': 'flex',
                            'flexDirection':'column'
                        }}
                        noValidate

                        onSubmit={e=>{
                            e.preventDefault();
                            if (type.includes('frequent')){
                                newFrequent()
                            }else{
                                newIncome()
                            }
                        }}
                    >

                        <DialogContent sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                            'display': 'flex',
                            'flexDirection':'column'
                        }}>

                            <OnlineChecker/>
                            {msg ? <Alert severity={msg.includes('Successful') ? "success" : "error"}>{t(msg)}</Alert> : null}

                            <TextField id="name"
                                       type="text"

                                       label={t(`Name`)}
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

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {type.includes('frequent') ?
                                <FrequencySelector changeFrequencyInput={changeFrequencyInput} changeFrequencyScale={changeFrequencyScale} frequencyInput={frequencyInput} frequencyScale={frequencyScale}/> :

                                <DatePicker label={t('Date')} value={dayjs(dateInput)} defaultValue={dayjs(current_date)} onChange={(newValue)=>setDateInput(dayjs(newValue).toDate().toISOString())} />
                                }
                            </LocalizationProvider>
                            <Autocomplete
                                freeSolo
                                disablePortal
                                id="category"
                                options={categories}
                                value={categoryInput}

                                onChange={(e, value) => setCategoryInput(value)}
                                renderInput={(params) => <TextField {...params} onChange={e => {setCategoryInput(e.target.value)}} label={t("Category")} />}
                            />

                        </DialogContent>



                        <DialogActions>
                            <Button  onClick={()=>setOpen(false)}>
                                {t('Cancel')}

                            </Button>
                            <Button variant="contained" type={'submit'}>
                                {type.includes('income') ? t("New Income") : t('New Expense')}

                            </Button>

                        </DialogActions>

                    </Box>

                </Dialog>


            </ThemeProvider>








        </div>

    )
}

export default QuickInput;