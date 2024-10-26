import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#3DC2EC' },
        secondary: { main: '#73f8e7' },
        black: {
            main: "#242B2E"
        },
        background: {
            default: "#f8f6f4",
            paper: "transparent", // Make sure to set this to transparent if you're using a gradient
        },
        textColor: {
            main: "#111111",
        }
    },
    typography: {
        fontFamily: 'Montserrat, sans-serif',
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFDEE9',
                    backgroundImage: 'linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)',
                    // Optional additional styles
                    
                },
            },
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#2bcdd3' },
        secondary: { main: '#f48fb1' },
        background: {
            default: '#121212',
            paper: 'transparent', // Keep this transparent for the gradient
        },
    },
});
