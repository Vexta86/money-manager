import React, {useEffect} from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {useTranslation} from "react-i18next";
import {theme} from "../config/ThemeMUI";
import dayjs from "dayjs";

const FilterMonth = ({changeDate: changeDate,
                         selectedDate: selectedDate,
                         }) => {
    const {t} = useTranslation();

    return(
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label={t('Month') + '/' + t("Year")}
                            defaultValue={dayjs(selectedDate)}
                            views={['month', 'year']}

                            onChange={(newValue) => changeDate(newValue)} />
            </LocalizationProvider>
        </ThemeProvider>
    )
};

export default FilterMonth;