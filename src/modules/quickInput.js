import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {daysToMonths, formatMoney, localhost, weeksToMonths, yearsToMonths} from "../util";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import {Button, FormControl} from "@mui/material";
import {theme, themeRed} from "../config/ThemeMUI";
import {ThemeProvider} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import FrequencySelector from "./FrequencySelector";
import frequencySelector from "./FrequencySelector";
const QuickInput = ({   auth: auth,
                        type: type,
                        categories: categories,
                        }) =>{

    const [nameInput, setNameInput] = useState('');
    const [priceInput, setPriceInput] = useState(10000);
    const [categoryInput, setCategoryInput] = useState('');
    const [msg, setMsg] = useState('');

    const { t } = useTranslation();


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
        try {
            const response = await fetch(`${localhost}/frequent-outcomes`, {
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
    const newIncome = async () => {
        try {
            const response = await fetch(`${localhost}/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Authorization': auth,
                },
                body: JSON.stringify({
                    'name': nameInput ? nameInput : type.includes('income') ? t("New Income") : t('New Expense'),
                    'category': categoryInput ? categoryInput : 'none',
                    'price': priceInput
                })
            });

            if (!response.ok) {
                console.error('Network response was not ok');
            }
            const data = await response.json();
            if (response.ok){



                console.log(data);
                window.location.reload();
            } else {

                setMsg(data.message);
            }


        } catch (error) {

            setMsg('Error occurred while fetching data');
        }
    };

    return(
        <div className={"quickContainer"}>



            <ThemeProvider theme={type.includes('income') ? theme : themeRed}>
                {msg ? <Alert severity={msg.includes('successful') ? "success" : "error"}>{t(msg)}</Alert> : null}
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                        'display': 'flex',
                        'flex-direction':'column'
                    }}
                    noValidate
                    autoComplete="off"
                >

                    <TextField id="name"
                               type="text"

                               label={t("Name")}
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
                        renderInput={(params) => <TextField {...params} onChange={e => {setCategoryInput(e.target.value)}} label="Category" />}
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