import {ThemeProvider, CssBaseline} from '@mui/material';
import {darkTheme, lightTheme} from "./theme/theme"; // Import Tailwind CSS
import Navbar from "./components/Navbar/Navbar";
import './App.css';
import Auth from "./components/Auth/Auth.tsx";
import {ThemeContext} from "./theme/ThemeContext.tsx";
import React, {useContext} from "react";
import {Outlet} from "react-router-dom";



const App: React.FC = () => {



    const {isDarkMode, showCustomTheme, toggleTheme, toggleCustomTheme} = useContext(ThemeContext);
    return (

        <ThemeProvider theme={isDarkMode ? (showCustomTheme ? darkTheme : lightTheme) : lightTheme}>
            <CssBaseline/>
            <Navbar
                showCustomTheme={showCustomTheme}
                toggleCustomTheme={toggleCustomTheme}
                mode={isDarkMode ? 'dark' : 'light'}
                toggleColorMode={toggleTheme}
            />
            <Outlet/>
            <Auth/>
        </ThemeProvider>


    );
}

export default App;
