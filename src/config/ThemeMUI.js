import {createTheme} from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: '#00ADB5',
            light: '#EEEEEE',
            dark: '#393E46',
            contrastText: '#fff',
        }
    },

});

const themeRed = createTheme({
    palette: {
        primary: {
            main: '#b50000',
            light: '#EEEEEE',
            dark: '#463939',
            contrastText: '#fff',
        }
    },

});

export {theme, themeRed};