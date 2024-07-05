import React, {useState, useEffect} from "react";
import { useNavigate} from 'react-router-dom';
import './styles.css';
import {formatMoney, API_URL, daysToMonths, weeksToMonths, yearsToMonths, monthToFormat} from "../util";
import {useTranslation} from "react-i18next";


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Icon,
    Typography
} from "@mui/material";

import Alert from "@mui/material/Alert";
import FrequencySelector from "../components/income-outcome/FrequencySelector";
import OnlineChecker from "../components/shared/OnlineChecker";




const EditPage = ({auth, language, categories, elementID, type, open, doc, changeOpen, fetchCome}) => {

    // receives auth as a parameter when redirecting

    const { t, i18n } = useTranslation();



    const handleClose = ()=>{
        changeOpen(false)

    }




    const isFrequent = type?.includes('frequent');



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

        console.log(`${API_URL}/${type}/${elementID}`)
        if (confirmed){
            fetch(`${API_URL}/${type}/${elementID}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Authorization': auth,
                },
            }).then(res=>{
                return(res.json())
            })
                .then(d => console.log(d))
                .finally(()=>{
                    handleClose()
                })
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

            if(frequencyScale?.includes('Day')){


                frequencyMonth = (daysToMonths(frequencyInput));

            } else if(frequencyScale?.includes('Week')){


                frequencyMonth = (weeksToMonths(frequencyInput));

            } else if (frequencyScale?.includes('Year')){

                frequencyMonth = (yearsToMonths(frequencyInput));

            } else if (frequencyScale?.includes('Month')){

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



        fetch(`${API_URL}/${type}/${elementID}`, {
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

            }
            else {
                setMsg('Something went wrong')
            }
        })
            .finally(()=>{
                const currentDate = new Date()
                handleClose();

                fetchCome(currentDate.getMonth() + 1, currentDate.getFullYear() )
            })

    }


    useEffect(() => {
        setIsLoading(true)
        i18n.changeLanguage(language).then();

        if (!auth) {
            return; // No need to make API call if token doesn't exist
        }

        setPriceInput(doc.price);
        setCategoryInput(doc.category);
        setNameInput(doc.name)

        if (isFrequent) {
            const ogFrequency = monthToFormat(doc.frequency, language);
            setFrequencyInput(ogFrequency[0]);
            setFrequencyScale(ogFrequency[1]);
        } else {

            setSelectedDate(dayjs(doc.date))


        }

        setIsLoading(false)






    }, []);






    return (

        <Dialog open={open} onClose={handleClose} >
            <DialogTitle >

                <Box display={'flex'} alignItems={'center'} >
                    <Icon onClick={()=>handleClose()} style={{cursor: "pointer", marginRight: "8%"}}  >
                        arrow_back
                    </Icon>


                    <Typography variant={'h4'} >
                        {t("Editing")}
                    </Typography>
                </Box>


            </DialogTitle >

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
                    onSave();
                }}
            >

                <DialogContent sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    'display': 'flex',
                    'flexDirection':'column'
                }}>



                    <OnlineChecker/>

                    {msg ? <Alert severity={msg?.includes('successful') ? "success" : "error"}>{t(msg)}</Alert> : null}


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






                </DialogContent>

                <DialogActions>


                    <Button onClick={onDelete}
                            startIcon={<Icon>delete</Icon>}
                    >️
                        {t("Delete")}
                    </Button>

                    <Button
                            type={'submit'}
                            variant={"contained"}
                            startIcon={<Icon>save</Icon>}
                    >
                        {t("Save")}
                    </Button>


                </DialogActions>
            </Box>

        </Dialog>


    );
}


export default EditPage;
