import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#3DC2EC' },
        secondary: { main: '#73f8e7' },
        black: {
            main: "#011f31"
        },
        background: {
            default: "rgb(252, 252, 252)",
            paper: "rgb(252, 252, 252)",
        },
        text: {
            primary: "#111111",
            secondary: "#111111",
        }
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': {
                        color: '#011f31', // Màu nhãn cho primary color
                    },
                    '& .MuiInputBase-input': {
                        color: '#111111', // Màu văn bản chính
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#011f31', // Màu viền cho primary color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3DC2EC', // Màu viền khi hover
                    },
                    '&:hover .MuiInputLabel-root': {
                        color: '#3DC2EC', // Màu chữ nhãn khi hover
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#011f31', // Đặt màu nhãn cho InputLabel
                    '&.Mui-focused': {
                        color: '#3DC2EC', // Màu nhãn khi focus
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    color: '#111111', // Đặt màu văn bản của Select
                    '&:hover': {
                        backgroundColor: 'rgba(61, 194, 236, 0.1)', // Màu nền khi hover
                    },
                    '&.Mui-focused': {
                        borderColor: '#3DC2EC', // Màu viền khi Select được focus
                    },
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
        text: {
            primary: '#f1f6f9', // Light text color for dark mode
            secondary: '#f1f6f9', // Light text color for dark mode
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': {
                        color: '#2bcdd3', // Màu nhãn cho primary color
                    },
                    '& .MuiInputBase-input': {
                        color: '#f1f6f9', // Màu văn bản cho dark mode
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2bcdd3', // Màu viền cho primary color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2bcdd3', // Màu viền khi hover
                    },
                    '&:hover .MuiInputLabel-root': {
                        color: '#2bcdd3', // Màu chữ nhãn khi hover
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& .MuiSelect-root': {
                        color: '#f1f6f9', // Màu văn bản chính
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2bcdd3', // Màu viền cho primary color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2bcdd3', // Màu viền khi hover
                    },
                    '&:hover .MuiSelect-root': {
                        color: '#2bcdd3', // Màu chữ khi hover
                    },
                    '& .MuiInputLabel-root': {
                        color: '#2bcdd3', // Màu nhãn cho primary color
                    },
                    '&:hover .MuiInputLabel-root': {
                        color: '#2bcdd3', // Màu chữ nhãn khi hover
                    },
                },
            },
        },
    },
});
