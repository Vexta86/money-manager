import React from "react";
import {useTranslation} from "react-i18next";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const FilterCategory = ({selectedCategory, changeCategory, monthCategories, theme}) => {
    const {t} = useTranslation();

    return(

            <FormControl fullWidth>
                <InputLabel id="select-category-label" > {t("Category")}</InputLabel>
                <Select
                    labelId="select-category-label"
                    id="select-category"
                    value={selectedCategory}
                    label={"Category"}
                    onChange={(e) => changeCategory(e.target.value)}
                >

                    {monthCategories.length > 1 || monthCategories.length === 0 ?
                        <MenuItem value="" key={'All'}>
                            {t("All categories")}
                        </MenuItem> : null}

                    {monthCategories ? monthCategories.map((item) => {
                        return <MenuItem value={item} key={item}>{item}</MenuItem>;
                    }) : null}
                </Select>
            </FormControl>





    )
};

export default FilterCategory;