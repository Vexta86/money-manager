import React from 'react';
import {msgBoxSx} from "../../config/SxStyles";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";

const LoadingMessage = ({msg, isLoading}) => {
    const { t, i18n } = useTranslation();
    return (
        <Box sx={msgBoxSx}>
            {msg ?
                <Alert severity={msg.includes('success') ? "success" : "error"}>
                    {t(msg)}
                </Alert> :
                <></>}
            {isLoading ?
                <LinearProgress/> :
                <></>
            }

        </Box>
    );
};

export default LoadingMessage;