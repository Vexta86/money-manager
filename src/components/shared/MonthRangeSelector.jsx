import React from 'react';
import {Button, Icon, Slider, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";

const MonthRangeSelector = ({monthRange, setMonthRange }) => {
    const {t} = useTranslation();
    return (
        <Stack alignItems={'center'}>
            <Typography variant={'h3'} margin={'8% 0 2% 0'}>
                {monthRange} {t("Previous Months")}
            </Typography>
            <Box width={"100%"} display={'flex'}>

                <Button disabled={monthRange<=2}
                        startIcon={<Icon>remove</Icon>}
                        margin={'4%'}
                        onClick={()=>setMonthRange(monthRange-1)}
                />
                <Slider
                    defaultValue={monthRange}
                    value={monthRange}
                    step={1} min={2} max={12}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    onChange={(e, newValue)=> {
                        setMonthRange(newValue)

                    }}
                    margin={'4%'}
                />
                <Button  disabled={monthRange>=12}
                         startIcon={<Icon>add</Icon>}
                         margin={'4%'}
                         onClick={()=>setMonthRange(monthRange+1)}
                />
            </Box>
        </Stack>

    );
};

export default MonthRangeSelector;