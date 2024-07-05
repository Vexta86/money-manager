import React from 'react';
import {formatMoney} from "../../util";
import Box from "@mui/material/Box";
import {Chip, Icon, Tooltip} from "@mui/material";
import {useTranslation} from "react-i18next";

const StatChip = ({item}) => {
    const {t, i18n} = useTranslation();
    const label = `${t(item.name)} = ${formatMoney(item.value)}`
    return(
        <Box margin={'2% 0 2% 0'}>
            <Tooltip title={t(item.name)}>
                <Chip label={label} color={'primary'} icon={<Icon>{item.icon}</Icon>}/>
            </Tooltip>
        </Box>
    )
};

export default StatChip;