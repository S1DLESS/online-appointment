import { createTheme } from "@mui/material/styles";
import { Theme } from "@mui/material/styles/createTheme";


const defaultTheme = createTheme()

export const theme = createTheme({
    palette: {
        // neutral: {
        //     main: '#212B36'
        // },
        primary: {
            main: '#00AB55',
            light: '#5BE584',
            dark: '#007B55'
        },
        secondary: {
            main: '#3366FF',
            light: '#84A9FF',
            dark: '#1939B7'
        },
        error: {
            main: '#FF5630',
            light: '#FFAC82',
            dark: '#B71D18'
        },
        warning: {
            main: '#FFAB00',
            light: '#FFD666',
            dark: '#B76E00'
        },
        info: {
            main: '#00B8D9',
            light: '#61F3F3',
            dark: '#006C9C'
        },
        success: {
            main: '#36B37E',
            light: '#86E8AB',
            dark: '#1B806A'
        },
        grey: {
            100: '#F9FAFB',
            200: '#F4F6F8',
            300: '#DFE3E8',
            400: '#C4CDD5',
            500: '#919EAB',
            600: '#637381',
            700: '#454F5B',
            800: '#212B36',
            900: '#161C24'
        },
        text: {
            primary: '#212B36',
            secondary: '#637381',
            disabled: '#919EAB'
        }
    },
    typography: {
        fontFamily: "'Noto Sans', sans-serif",
        h1: {
            fontSize: "64px",
            [defaultTheme.breakpoints.down('lg')]: {
                fontSize: "58px"
            },
            [defaultTheme.breakpoints.down('md')]: {
                fontSize: "52px"
            },
            [defaultTheme.breakpoints.down('sm')]: {
                fontSize: "40px"
            },
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: 0
        },
        h2: {
            fontSize: "48px",
            [defaultTheme.breakpoints.down('lg')]: {
                fontSize: "44px"
            },
            [defaultTheme.breakpoints.down('md')]: {
                fontSize: "40px"
            },
            [defaultTheme.breakpoints.down('sm')]: {
                fontSize: "32px"
            },
            fontWeight: 800,
            lineHeight: 1.33,
            letterSpacing: 0
        },
        h3: {
            fontSize: "32px",
            [defaultTheme.breakpoints.down('lg')]: {
                fontSize: "30px"
            },
            [defaultTheme.breakpoints.down('md')]: {
                fontSize: "26px"
            },
            [defaultTheme.breakpoints.down('sm')]: {
                fontSize: "24px"
            },
            fontWeight: 700,
            lineHeight: 1.5,
            letterSpacing: 0
        },
        h4: {
            fontSize: "24px",
            [defaultTheme.breakpoints.down('md')]: {
                fontSize: "20px"
            },
            fontWeight: 700,
            lineHeight: 1.5,
            letterSpacing: 0
        },
        h5: {
            fontSize: "20px",
            [defaultTheme.breakpoints.down('md')]: {
                fontSize: "19px"
            },
            [defaultTheme.breakpoints.down('sm')]: {
                fontSize: "18px"
            },
            fontWeight: 700,
            lineHeight: 1.5,
            letterSpacing: 0
        },
        h6: {
            fontSize: "18px",
            [defaultTheme.breakpoints.down('sm')]: {
                fontSize: "17px"
            },
            fontWeight: 700,
            lineHeight: 1.55,
            letterSpacing: 0
        },
        subtitle1: {
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: 0
        },
        subtitle2: {
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: 1.57,
            letterSpacing: 0
        },
        body1: {
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: 0
        },
        body2: {
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: 1.57,
            letterSpacing: 0
        },
        caption: {
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: 0
        },
        overline: {
            fontSize: "12px",
            fontWeight: 700,
            lineHeight: 1.5,
            letterSpacing: 0
        },
        button: {
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: 1.71,
            letterSpacing: 0,
            textTransform: 'none'
        }
    },
    components: {
        MuiTypography: {
            defaultProps: {
                color: 'textPrimary'
            }
        },
        MuiAlert: {
            styleOverrides: {
                standardInfo: {
                    color: '#003768',
                    backgroundColor: '#cafdf5',
                    borderRadius: '8px'
                },
                icon: {
                    color: '#00b8d9 !important'
                }
            }
        },
        MuiAlertTitle: {
            styleOverrides: {
                root: {
                    fontWeight: 600
                }
            }
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0
            },
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px',
                    overflow: 'hidden'
                }
            }
        }
    }
})

export const formTheme = (outerTheme: Theme, mainColor: string) => createTheme({
    ...outerTheme,
    palette: {
        ...outerTheme.palette,
        primary: {
            main: mainColor
        }
    }
})