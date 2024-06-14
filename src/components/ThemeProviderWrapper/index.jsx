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
            success_text: '#A1D797',
            success: '#E0F2DC',
            grey: '#506288',
        },
        iconButton: {
            outlineLightColor: alpha('#BFC8D9', 0.38),
            lightPeriwinkle: '#D7D8FF',
            error_200: '#EDACAC',
            error_50: '#FBEBEB',
            success_100: '#E0F2DC',
            success_300: '#A1D797',
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
            lightBlue: '#D6E2FF',
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
            variants: [
                {
                    props: { variant: 'outlined' },
                    style: { boxShadow: 'none', border: '1px solid #D6E2FF' },
                },
            ],
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
