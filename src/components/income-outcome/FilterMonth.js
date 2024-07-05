import React from "react";

import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

const FilterMonth = ({changeDate,selectedDate, theme}) => {
    const {t} = useTranslation();

    return(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label={t('Month') + '/' + t("Year")}
                            defaultValue={dayjs(selectedDate)}
                            views={['month', 'year']}

                            onChange={(newValue) => changeDate(newValue)} />
            </LocalizationProvider>

    )
};

export default FilterMonth;