import {ThemeProvider, CssBaseline} from '@mui/material';
import {darkTheme, lightTheme} from "./theme/theme"; // Import Tailwind CSS
import Navbar from "./components/Navbar/Navbar";
import './App.css';

import {ThemeContext} from "./theme/ThemeContext.tsx";
import React, {Fragment, useContext, useEffect} from "react";
import {Outlet} from "react-router-dom";
import {useAppDispatch} from "./state/store.ts";
import {getUser} from "./state/Authentication/Reducer.ts";
import ScrollToTopButton from "./components/Home/ScrollToTopButton.tsx";


const App: React.FC = () => {
    const dispatch = useAppDispatch();

    const storedAccessToken = localStorage.getItem('accessToken');
    useEffect(() => {
        if (storedAccessToken) {
            console.log("Access token from localStorage: ", storedAccessToken);
            dispatch(getUser());
        } else {
            console.log("No access_token found in localStorage");
        }
    }, [dispatch, storedAccessToken]);

    const {isDarkMode, showCustomTheme} = useContext(ThemeContext);
    return (
        <ThemeProvider theme={isDarkMode ? (showCustomTheme ? darkTheme : lightTheme) : lightTheme}>
            <Fragment>
                <CssBaseline/>
                <Navbar/>
                <ScrollToTopButton/>
                <Outlet/>

            </Fragment>
        </ThemeProvider>
    );
}

export default App;
