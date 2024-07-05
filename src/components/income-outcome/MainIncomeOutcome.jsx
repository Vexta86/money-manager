import React, {useContext, useEffect, useState} from 'react';
import dayjs from "dayjs";
import {Navigate} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Stack, Typography} from "@mui/material";

import FilterMonth from "./FilterMonth";
import FilterCategory from "./FilterCategory";
import QuickInput from "./quickInput";
import LinearProgress from "@mui/material/LinearProgress";
import MainTableAndStats from "./MainTableAndStats";
import MainMenu from "../shared/mainMenu";
import {useTranslation} from "react-i18next";
import {MyContext} from "../../App";
import {fetchSeveral} from "../../services/mainService";
import {mainStackSx} from "../../config/SxStyles";

// Function to calculate the total price
function calculateTotal(arr) {
    return arr.reduce((total, item) => total + item.price, 0);
}

// Function to calculate the average price
function calculateAverage(arr) {
    if (arr.length === 0) return 0;
    return calculateTotal(arr) / arr.length;
}

const MainIncomeOutcome = ({auth, docs, fetchCome, theme, language, monthCategories, isLoading, palette, name, type, fetchData}) => {

    const {t, i18n} = useTranslation();
    const {isAuth} = useContext(MyContext);
    const current_date = new Date();

    const [month, setMonth] = useState(current_date.getMonth() + 1);
    const [year, setYear] = useState(current_date.getFullYear());

    const [selectedDate, setSelectedDate] = useState(dayjs(current_date));


    const [selectedCategory, setSelectedCategory] = useState('');


    const [previousMonths, setPreviousMonths] = useState([]);
    const [stats, setStats] = useState([])

    async function changeSelectedDate(date) {
        setSelectedDate(date);
        const selectedMonth = date.month() + 1;
        const selectedYear = date.year();
        setMonth(selectedMonth);
        setYear(selectedYear);


        await fetchCome(selectedMonth, selectedYear);
        await fetchPrevious(3, date)



    }

    async function changeCategory(newCategory) {
        setSelectedCategory(newCategory);
    }


    async function fetchPrevious(range, date) {
        setPreviousMonths(null)
        const several = await fetchSeveral(auth, fetchData, date ? date : selectedDate, range ? range : 3)
        setPreviousMonths(several)

        const avg = {
            name: t('Average'),
            icon: 'trending_up',
            value: calculateAverage(several)
        };
        const total = {
            name: t('Total'),
            icon: 'functions',
            value: calculateTotal(several)
        }

        setStats([avg, total])

    }

    useEffect( () => {

        fetchCome(month, year);
        fetchPrevious().then()


        i18n.changeLanguage(language).then();
        if (!auth) {
            return; // No need to make API call if token doesn't exist
        }

        setSelectedCategory('');

    }, []);






    if (!isAuth) {
        return <Navigate to='/money-manager/login' />;
    }
    return (
        <ThemeProvider theme={theme}>
        <Stack sx={mainStackSx}>

            <Box className="container-2" >

                    <Box width={"90%"} alignItems={"center"}>

                        <Stack width={"100%"} style={{alignItems: 'center'}}>

                            <Typography variant={'h1'} component={'h1'}>
                                {t(name)}
                            </Typography>

                            <QuickInput auth={auth}
                                        type={type}
                                        categories={monthCategories}
                                        refreshData={fetchCome}
                            />

                            <Box display={'flex'} margin={'2%'}>

                                <FilterMonth selectedDate={selectedDate}
                                             changeDate={changeSelectedDate} theme={theme}/>

                                <FilterCategory selectedCategory={selectedCategory}
                                                changeCategory={changeCategory}
                                                monthCategories={monthCategories} theme={theme}/>


                            </Box>

                        </Stack>

                        {isLoading ?
                            <Box width={"100%"}>
                                <LinearProgress/>
                            </Box> :

                            <MainTableAndStats docs={docs} language={language}
                                               selectedCategory={selectedCategory}
                                               auth={auth} monthCategories={monthCategories}
                                               palette={palette} type={type}
                                               refresh={fetchCome} name={name}
                                               month={month} year={year}
                                               selectedDate={selectedDate} fetchPrevious={fetchPrevious}
                                               previousMonths={previousMonths} stats={stats}
                            />

                        }


                    </Box>



            </Box>


            <div className="menuContainer">
                <MainMenu auth={auth} language={language}/>
            </div>
        </Stack>
        </ThemeProvider>

    );
};

export default MainIncomeOutcome;