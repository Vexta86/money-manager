import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {theme} from "../config/ThemeMUI";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {formatMoney} from "../util";
import TextField from "@mui/material/TextField";
import {ThemeProvider} from "@mui/material/styles";
import Box from "@mui/material/Box";

const FrequencySelector = ({
    frequencyInput: frequencyInput,
    frequencyScale: frequencyScale,
    changeFrequencyInput: changeFrequencyInput,
    changeFrequencyScale: changeFrequencyScale
}) => {
    const { t } = useTranslation();




        return(





                    <div className='filterContainer'>

                        <FormControl sx={{ width: '15ch' }}>
                            <TextField id="price"
                                       type="number"
                                       label={t("Frequency")}
                                       variant="outlined"
                                       value={frequencyInput}
                                       error={!frequencyInput}
                                       shrink
                                       fullWidth={true}
                                       onChange={(e) => changeFrequencyInput(e.target.value)}

                            />
                        </FormControl>

                        <FormControl>

                            <InputLabel id="select-scale-label">{frequencyInput}</InputLabel>
                            <Select
                                labelId="select-scale-label"
                                id="select-scale"
                                value={frequencyScale}
                                defaultValue={frequencyScale}
                                label={t("Frequency")}
                                onChange={(e) => changeFrequencyScale(e.target.value)}
                            >


                                <MenuItem value="Month">
                                    {frequencyInput > 1 ? t('Months') : t('Month')}
                                </MenuItem>

                                <MenuItem value="Day">
                                    {frequencyInput > 1 ? t('Days') : t('Day')}
                                </MenuItem>

                                <MenuItem value="Week">
                                    {frequencyInput > 1 ? t('Weeks') : t('Week')}
                                </MenuItem>

                                <MenuItem value="Year">
                                    {frequencyInput > 1 ? t('Years') : t('Year')}
                                </MenuItem>


                            </Select>
                        </FormControl>

                    </div>








        )
}

export default FrequencySelector;