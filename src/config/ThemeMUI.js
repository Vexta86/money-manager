import {createTheme, responsiveFontSizes} from "@mui/material/styles";


const colors = {
    main: '#00ADB5',
    light: '#EEEEEE',
    dark: '#393E46',
    contrastText: '#fff',
}

const colorsRed = {
    main: '#b50000',
    light: '#EEEEEE',
    dark: '#463939',
    contrastText: '#fff',
}

function typo(colors){

    return({
            fontFamily: 'Montserrat, sans-serif', // Set Montserrat as the default font family
            h1: {
                fontSize: '2.5rem', // Larger font size for h1
                fontWeight: 700,
                color: colors.dark
            },
            h2: {
                fontSize: '2rem', // Slightly smaller for h2
                fontWeight: 600,
                color: colors.dark
            },
            h3: {
                fontSize: '1.75rem', // Smaller for h3
                fontWeight: 500,
                color: colors.dark
            },
            h4: {
                fontSize: '1.5rem', // Adding h4 for completeness
                fontWeight: 500,
                color: colors.dark
            },

            body1: {
                fontSize: '1rem', // Standard body text
                color: colors.dark
            },
            body2: {
                fontSize: '0.875rem', // Smaller body text
                color: colors.dark
            },
        }
    )
}

let theme = createTheme({
    palette: {
        primary: {
            main: colors.main,
            light: colors.light,
            dark: colors.dark,
            contrastText: colors.contrastText,
        },
    },
    typography: typo(colors)
});
// Apply responsive font sizes
theme = responsiveFontSizes(theme);


let themeRed = createTheme({
    palette: {
        primary: colorsRed
    },
    typography: typo(colorsRed)

});

themeRed = responsiveFontSizes(themeRed)
// PaletteRed with warm colors
// PaletteRed with warm colors including red, orange, and violet
// PaletteRed with warm colors starting from #b50000
// PaletteRed with pastel-like warm colors starting from #b50000
const paletteRed = ['#b50000', '#ffee99', '#ffcc99', '#ff9966', '#ffcc66', '#ffaa99', '#ffccaa', '#ffcccc', '#ff99ff', '#ffccff', '#ffccee', '#99ffee', '#99ffcc', '#99ff99', '#ccff99', '#ffeecc', '#ffccaa', '#ffaa99', '#ffcc66', '#ccff66', '#99ff66', '#66cc66', '#66cc99', '#99cccc'];

// Palette with pastel-like cold colors starting from #00adb5
const palette = ['#00adb5', '#66ccff', '#6699cc', '#66aacc', '#66ccaa', '#6699cc', '#66aacc', '#6699cc', '#66ccaa', '#66aacc', '#6699cc', '#66ccff', '#66aacc', '#6699cc', '#66ccaa', '#6699cc', '#66ccff', '#66aacc', '#66ccaa', '#6699cc', '#66ccff', '#66aacc', '#66ccaa', '#6699cc'];




export {theme, themeRed, paletteRed, palette};