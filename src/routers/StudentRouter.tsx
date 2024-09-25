

import Navbar from "../components/Navbar/Navbar.tsx";
import React, {useContext} from "react";
import {ThemeContext} from "../theme/ThemeContext.tsx";
import {Route, Routes} from "react-router-dom";
import Home from "../components/Home/Home.tsx";
import App from "../App.tsx";
import Auth from "../components/Auth/Auth.tsx";

const StudentRouter = () => {
    const {isDarkMode, showCustomTheme, toggleTheme, toggleCustomTheme} = useContext(ThemeContext);

    return (
        <div>
            <Navbar
                showCustomTheme={showCustomTheme}
                toggleCustomTheme={toggleCustomTheme}
                mode={isDarkMode ? 'dark' : 'light'}
                toggleColorMode={toggleTheme}
            />
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/account/:signup" element={<App/>}/>
            </Routes>
            <Auth/>

        </div>
    );
};

export default StudentRouter;
