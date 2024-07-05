import React from 'react';
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";

const Header = () => {
    const { t, i18n } = useTranslation();
    return (
        <Box>
            <Typography variant={'h1'} component={'h1'} paddingBottom={'4%'} color={'primary'}>
                {t('Money Manager')}
            </Typography>
        </Box>
    );
};

export default Header;