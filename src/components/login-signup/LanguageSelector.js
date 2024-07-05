import React from 'react';
import ButtonGroup from "@mui/material/ButtonGroup";
import {Button} from "@mui/material";

const LanguageSelector = ({setLanguage}) => {
    return (
        <ButtonGroup  >
            <Button onClick={() => setLanguage('en')} >English</Button>
            <Button onClick={() => setLanguage('es')}>Español</Button>

        </ButtonGroup>
    );
};

export default LanguageSelector;