import React from 'react';
import {Button, Icon, Skeleton, Slider, Stack, Typography} from "@mui/material";
import {parseToDate} from "../../util";
import {LineChart, PieChart} from "@mui/x-charts";
import {palette as mainPalette} from "../../config/ThemeMUI";
import Box from "@mui/material/Box";
import StatChip from "./StatChip";
import {useTranslation} from "react-i18next";
import MonthRangeSelector from "../shared/MonthRangeSelector";

const Stats = ({year, language, month, palette, transformedDataset, monthRange, setMonthRange, previousMonths, stats, name, visible}) => {

    const {t} = useTranslation();

    if (!visible){
        return (<></>)
    }
    return (
        <Stack alignItems={'center'}>
            <Typography variant={'h2'} component={'h2'} margin={'8% 0 4% 0'}>
                {parseToDate(month.toString() + '-' + year.toString(), language)}
            </Typography>
            <PieChart width={400}
                      height={200}
                      colors={palette ? palette : mainPalette}
                      slotProps={{
                          legend: {hidden: false},

                      }}
                      series={[
                          {
                              highlightScope: {faded: 'global', highlighted: 'item'},
                              faded: {
                                  innerRadius: 15,
                                  additionalRadius: -15,
                                  color: 'gray'
                              },
                              data: transformedDataset
                          }

                      ]}/>



            <MonthRangeSelector setMonthRange={setMonthRange} monthRange={monthRange}/>

            {previousMonths ?
                <Box width={"100%"} alignItems={'center'}>

                    <Stack alignItems={'center'}>
                        {stats?.map(item=>{
                            return(
                                <StatChip item={item}/>
                            )
                        })}
                    </Stack>

                    <LineChart
                        dataset={previousMonths}
                        colors={palette}
                        series={[
                            {dataKey: "price", label: t(name)},

                        ]}
                        xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                        margin={{ top: 60, bottom: 30, left: 70, right: 0 }}
                        height={390}

                    />

                </Box>
                :
                <Skeleton

                    variant="rectangular"
                    width={'90%'}
                    height={490}
                />

            }

        </Stack>
    );
};

export default Stats;