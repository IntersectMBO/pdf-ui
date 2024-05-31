'use client';

import '@fontsource/poppins/100.css';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';

import {
    ThemeProvider,
    alpha,
    createTheme,
    responsiveFontSizes,
} from '@mui/material/styles';
import Loader from '../Loader';

let theme = createTheme({
    palette: {
        primary: {
            main: '#0034AE',
            lightGray: '#F3F4F8',
            icons: {
                black: '#212A3D',
                error: '#CC0000',
                grey: '#ADAEAD',
            },
        },
        divider: {
            primary: '#B8CDFF',
        },
        badgeColors: {
            primary: '#0034AE',
            error: '#CC0000',
            errorLight: '#FF9999',
            secondary: '#39B6D5',
            lightPurple: '#D6D8FF',
        },
        iconButton: {
            outlineLightColor: alpha('#BFC8D9', 0.38),
            lightPeriwinkle: '#D7D8FF',
        },
        text: {
            grey: '#506288',
            darkPurple: '#242232',
            black: '#212A3D',
            orange: '#E76309',
        },
        border: {
            gray: '#E5DFE3',
            lightGray: '#CAC4D0',
        },
        button: {
            primary: '#3052F5',
        },
        card: {
            footerGrey: '#F2F4F8',
        },
        highlight: {
            blueGray: '#DBE1F8',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 100,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 4px 15px 0px #DDE3F5',
                    borderRadius: '16px',
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    marginRight: 0,
                    display: 'block',
                },
            },
        },
    },
    typography: {
        fontFamily: [
            'Poppins',
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});

theme = responsiveFontSizes(theme);

function ThemeProviderWrapper({ children }) {
    return (
        <ThemeProvider theme={theme}>
            <Loader />
            {children}
        </ThemeProvider>
    );
}

export default ThemeProviderWrapper;
