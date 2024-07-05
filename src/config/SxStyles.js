import {theme} from "./ThemeMUI";

export const mainStackSx = {
    backgroundColor: theme => theme.palette.primary.light,
    alignItems: 'center',
    minHeight: '100vh',
    height: '100%',
    padding: '8% 4% 8% 4%',
    overflowX: 'hidden',


    [theme.breakpoints.up('sm')]: {
        width: '100%',
        padding: '1% 0 1% 0',

    },
};

export const insideStackSx = {
    marginTop: '8%',
    marginBottom: '8%',
    alignItems: 'center',
    '& .MuiTextField-root': {m: 1, width: '25ch'},
    [theme.breakpoints.up('sm')]: {
        marginBottom: '1%',
        marginTop: '1%',
    },
}

export const typoLinkSx = {
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline"
}

export const msgBoxSx = {

    minWidth:'100px',
    minHeight:'40px',
    width:'fit-content',
    marginBottom: '4%',
    [theme.breakpoints.up('sm')]: {
        marginBottom: '1%',
    },

}


export const fieldTypoStackSx = {
    width: '90%',
    marginBottom: '8%',
    alignItems:'center',
    [theme.breakpoints.up('sm')]: {
        width: '60%',
        marginBottom: '4%',
    },
}
