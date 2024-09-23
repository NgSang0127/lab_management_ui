import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#2bcdd3' }, // Màu chính cho chế độ tối
        secondary: { main: '#f48fb1' }, // Màu phụ cho chế độ tối
        background: {
            default: '#121212', // Màu nền chính cho chế độ tối
            paper: '#1d1d1d', // Màu nền giấy cho chế độ tối
        },
    },
});
