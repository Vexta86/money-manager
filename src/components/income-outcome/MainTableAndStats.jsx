import React, {useEffect, useState} from 'react';
import Table from "./Table";
import Box from "@mui/material/Box";
import {LineChart, PieChart} from "@mui/x-charts";
import {palette as mainPalette} from "../../config/ThemeMUI";
import {Button, Chip, Icon, Skeleton, Slider, Stack, Tooltip, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {formatMoney, parseToDate} from "../../util";
import Stats from "./Stats";

const MainTableAndStats = ({auth, language, selectedCategory, docs, monthCategories, palette, type, refresh, month, year, fetchPrevious, previousMonths, name, stats}) => {



    const {t, i18n} = useTranslation();

    const groupedData = docs?.reduce((acc, obj) => {
        const { category, price } = obj;
        if (!acc[category]) {
            acc[category] = { category, total: 0 };
        }
        acc[category].total += price;
        return acc;
    }, {});
    const dataset = Object.values(groupedData).sort((a, b) => {
        if (a.total < b.total) {
            return 1; // b comes first
        }
        if (a.total > b.total) {
            return -1; // a comes first
        }
        return 0; // equal
    });

    const transformedDataset = dataset.map((item, index) => ({
        id: index,
        label: item.category, // Rename category to label
        value: item.total
    }));




    const [monthRange, setMonthRange] = useState(3)



    useEffect(()=>{
        fetchPrevious(monthRange)
    },[monthRange])


    return (
        <Stack width={"100%"} style={{alignItems: 'center'}} marginBottom={"20%"}>

            <Table auth={auth}
                   language={language}
                   selectedCategory={selectedCategory}
                   docs={docs}
                   headers={[t('Day'), t('Name'), t('Price'), t('Category')]}
                   type={type}
                   categories={monthCategories}
                   refresh={refresh}
            />


            <Stats stats={stats} palette={palette}
                   year={year} name={name} month={month}
                   language={language} monthRange={monthRange}
                   previousMonths={previousMonths}
                   setMonthRange={setMonthRange}
                   transformedDataset={transformedDataset}
                   visible={!selectedCategory || monthCategories.length === 1}
            />


        </Stack>
    );
};

export default MainTableAndStats;