import React, {useState, useEffect, useContext} from "react";
import {Navigate, useLocation, useNavigate} from 'react-router-dom';

import {formatMoney, localhost} from "../util";
import './styles.css';

import Menu from '../modules/menu'
import {useTranslation} from "react-i18next";
import {Avatar, Chip, CircularProgress, Icon, Slider, Stack, Tooltip, Typography} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {theme} from "../config/ThemeMUI";
import { BarChart } from '@mui/x-charts/BarChart';
import Box from "@mui/material/Box";
import {LineChart, PieChart} from "@mui/x-charts";

import {MyContext} from "../App";


const HomePage = () => {

    const { t, i18n } = useTranslation();

    // receives auth as a parameter when redirecting

    const location = useLocation();
    const language = location.state?.language;

    const [auth, setAuth] = useState(location.state?.auth);

    const current_date = new Date();


    const {isAuth, updateIsAuth} = useContext(MyContext);
    const [user, setUser] = useState("");

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(0);

    const [thisMonthIncome, setThisMonthIncome] = useState(0);
    const [thisMonthExpenses, setThisMonthExpenses] = useState(0);
    const [monthRange, setMonthRange] = useState(3)

    const [dataSet, setDataSet] = useState([]);
    const [stats, setStats] = useState([]);

    function fetchMonth(monthsAgo){
        const previous_month = new Date()

        previous_month.setMonth(current_date.getMonth() - monthsAgo);


        // setIsLoading(true)

        const incomePromise = fetch(`${localhost}/incomes?month=${previous_month.getMonth() + 1}&year=${previous_month.getFullYear()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': auth,
            },
        })
            .then(res=>{

                if (!res.ok) {
                    updateIsAuth(false);
                    throw new Error('Network response was not ok');
                }

                return res.json();
            })
            .then(data=>{

                setUser(data.userData.email);
                return (data.docs.reduce((acc, item)=>{
                    return acc + item.price;

                }, 0));

            })
            .then(total=>{
                // setIsLoading(false)
                return total;
            })
            .catch(err=>{
                console.error('Error fetching incomes', err);
            })

        const outcomePromise = fetch(`${localhost}/outcomes?month=${previous_month.getMonth() + 1}&year=${previous_month.getFullYear()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': auth,
            },
        })
            .then(res=>{
                if (!res.ok) {
                    updateIsAuth(false);
                    throw new Error('Network response was not ok');
                }

                return res.json();
            })
            .then(data=>{
                return (data.docs.reduce((acc, item) => {
                    return acc + item.price;
                }, 0));
            })
            .then(total=>{

                return total
            })
            .catch(err=>{
                console.error('Error fetching expenses', err);
            })

        return Promise.all([incomePromise, outcomePromise, previous_month])
    }

    const StatChip = (item) =>{
        const label = `${t(item.tag)} = ${formatMoney(item.value)}`
        return<>
            <Tooltip title={t(item.name)}>
                <Chip label={label} color={item.color} icon={<Icon>{item.icon}</Icon>}/>
            </Tooltip>

        </>
    }


    useEffect(() => {
        i18n.changeLanguage(language).then();



    }, [auth, language]);

    function fetchSeveralMonths(amount){


        const promises = []

        promises.push(fetchMonth(0).then(res=>{

            setThisMonthIncome(res[0]);
            setThisMonthExpenses(res[1])

            setBalance(res[0]-res[1])


            return({
                income: res[0],
                expenses: res[1],
                profit: res[0] - res[1],
                month: t("This Month")
            })

        }));
        promises.push(fetchMonth(1).then(res=>{


            return({
                income: res[0],
                expenses: res[1],
                profit: res[0] - res[1],
                month: t("Last Month")
            })



        }));
        for(let i = 2; i < amount; i++){
            promises.push(fetchMonth(i).then(res=>{
                const monthObj = {
                    income: res[0],
                    expenses: res[1],
                    profit: res[0] - res[1],
                    month: `${res[2].getMonth() + 1}/${res[2].getFullYear()}`
                }



                return(monthObj)
            }))
        }

        return Promise.all(promises);
    }

    useEffect(()=>{

        fetchSeveralMonths(monthRange)
            .then(res=> {
                setDataSet(res)
                return res
            })
            .then(data=>{


                const totalIncome = {
                    name: 'Total Income',
                    tag: 'Total',
                    icon: 'functions',
                    color: 'success',
                    value: data.reduce((sum, entry) => sum + entry.income, 0)
                };
                const totalExpenses = {
                    name: 'Total Expenses',
                    tag: 'Total',
                    icon: 'functions',
                    color: 'secondary',
                    value: data.reduce((sum, entry) => sum + entry.expenses, 0)
                };
                const totalProfit = {
                    name: "Total Profit",
                    tag: 'Total',
                    icon: 'functions',
                    color: 'primary',
                    value: data.reduce((sum, entry) => sum + entry.profit, 0)
                };

                const averageIncome = {
                    name:'Average Income',
                    tag: 'Average',
                    icon: 'trending_up',
                    color: 'success',
                    value: totalIncome.value / data.length
                };
                const averageExpenses = {
                    name:'Average Expenses',
                    tag: 'Average',
                    icon: 'trending_down',
                    color: 'secondary',
                    value: totalExpenses.value / data.length
                };
                const averageProfit = {
                    name: 'Average Profit',
                    tag: 'Average',
                    icon: 'attach_money',
                    color: 'primary',
                    value: totalProfit.value / data.length
                };
                setStats([ totalIncome, totalExpenses, totalProfit, averageIncome, averageExpenses,  averageProfit])

            })






    },[monthRange])

    if (!isAuth) {
        return <Navigate to='/money-manager/login' />;
    }
    return (
        <div>
            <div className="container">


                <Box className={'header-container'}  >
                    <Box style={{flex: 1, cursor:"pointer"}} onClick={()=>{
                        navigate('/money-manager/home/user', { state: {
                                auth:auth,
                                language: language,
                                id: user._id,
                                name: user.name,
                                email: user.email
                            }} )
                    }}>
                        <Avatar sx={{bgcolor: "#393E46"}}>
                            {user.name ? user.name[0] : null}
                        </Avatar>
                        <Typography style={{margin:0}}>
                            {user.name ? user.name : null}
                        </Typography>

                    </Box>
                    <Box style={{flex: 2}}>
                        <Typography variant={'h4'} >{t("Home")}</Typography>
                    </Box>

                </Box>


                <ThemeProvider theme={theme}>
                    {isLoading ?
                        <CircularProgress/> :
                        <div className={'container-data'}>



                            <Typography variant={'h5'}>{t("This Month")}</Typography>

                            <Typography>{formatMoney(balance)}</Typography>


                            <Box width={"50%"}>

                                <PieChart
                                    slotProps={{
                                        legend: { hidden: false },
                                    }}
                                    series={[
                                        {
                                            highlightScope: { faded: 'global', highlighted: 'item' },
                                            faded: { innerRadius: 15, additionalRadius: -15, color: 'gray' },
                                            data: [
                                                { id: 0, value: thisMonthIncome - thisMonthExpenses, label: t("Profit") },
                                                { id: 1, value: thisMonthExpenses, label: t("Expenses"), color: "#b50000"},

                                            ],
                                        },
                                    ]}
                                    width={400}
                                    height={200}

                                />
                            </Box>


                            <Typography variant={'h5'}> {monthRange} {t("Previous Months")}</Typography>
                            <Box width={"40%"}>

                                <Slider
                                    defaultValue={monthRange}
                                    step={1} min={2} max={12}
                                    aria-label="Default"
                                    valueLabelDisplay="auto"
                                    onChange={(e, newValue)=>setMonthRange(newValue)}
                                />
                            </Box>

                            <Stack direction={'row'} spacing={1}>
                                <Stack spacing={1}>
                                    {stats?.map(item=>{
                                        if (item.name.includes('Income')){
                                            return StatChip(item)
                                        }


                                    })}
                                </Stack>

                                <Stack spacing={1}>
                                    {stats?.map(item=>{
                                        if (item.name.includes('Expenses')){
                                            return StatChip(item)
                                        }


                                    })}
                                </Stack>
                            </Stack>

                            <Box width={"90%"}>
                                <BarChart
                                    dataset={dataSet}
                                    series={[
                                        {dataKey: "income", label: t("Income"), formatMoney, color: '#2f7c32'},
                                        {dataKey: "expenses", label: t("Expenses"), formatMoney, color:"#b50000"},
                                    ]}
                                    height={390}
                                    grid={{ horizontal: true }}
                                    xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                                    margin={{ top: 60, bottom: 30, left: 70, right: 0 }}
                                />
                            </Box>

                            <Stack spacing={1}>
                                {stats?.map(item=>{
                                    if (item.name.includes('Profit')){
                                        return StatChip(item)
                                    }


                                })}
                            </Stack>

                            <Box width={"90%"}>
                                <LineChart
                                    dataset={dataSet}
                                    series={[
                                        {dataKey: "profit", label: t("Profit")},

                                    ]}
                                    xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                                    margin={{ top: 60, bottom: 30, left: 70, right: 0 }}
                                    height={390}

                                />

                            </Box>


                        </div>

                    }
                </ThemeProvider>





            </div>
            <div className="menuContainer">
                <Menu auth={auth} language={language} />

            </div>
        </div>
        
    );
}
export default HomePage;
