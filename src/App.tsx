import { ThemeProvider, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import { ThemeContext } from './theme/ThemeContext.tsx';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {RootState, useAppDispatch} from './state/store.ts'; // Thêm useAppSelector
import { getUser } from './state/Authentication/Reducer.ts';
import ScrollToTopButton from './components/Home/ScrollToTopButton.tsx';
import Footer from './components/Home/Footer.tsx';
import MultiItemCarousel from './components/Home/MultiItemCarousel.tsx';
import { createTheme } from '@mui/material/styles';
import getTheme from './theme/getTheme.ts';
import { SidebarProvider } from './context/SidebarContext.tsx';
import {useSelector} from "react-redux";
import LoadingIndicator from "./components/Support/LoadingIndicator.tsx";

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { user, isLoading: authLoading } = useSelector((state:RootState) => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const storedAccessToken = localStorage.getItem('accessToken');

    const isAuthPage = location.pathname === '/account/signin' || location.pathname === '/account/signup';


    useEffect(() => {
        const verifyUser = async () => {
            if (storedAccessToken && !user) {
                console.log('Access token from localStorage: ', storedAccessToken);
                try {
                    await dispatch(getUser()).unwrap();
                } catch (error) {
                    console.error('Failed to fetch user: ', error);
                    localStorage.removeItem('accessToken');
                } finally {
                    setIsLoading(false);
                }
            } else {
                console.log('No accessToken found or user already loaded');
                setIsLoading(false);
            }
        };

        verifyUser();
    }, [dispatch, storedAccessToken, user]);

    const { isDarkMode, showCustomTheme } = useContext(ThemeContext);
    const mode = isDarkMode ? 'dark' : 'light';
    const defaultTheme = createTheme({ palette: { mode } });
    const signInSignUpTheme = createTheme(getTheme(mode));
    const themeToApply = showCustomTheme ? signInSignUpTheme : defaultTheme;
    const isHomePage = location.pathname === '/';

    if ((isLoading || authLoading) && !isAuthPage) {
        return <LoadingIndicator open={true} />;
    }

    return (
        <SidebarProvider>
            <ThemeProvider theme={themeToApply}>
                <Fragment>
                    <CssBaseline />
                    <Navbar />
                    {isHomePage && (
                        <section className="mb-5">
                            <MultiItemCarousel />
                        </section>
                    )}
                    <ScrollToTopButton />
                    <div className="mx-2">
                        <Outlet />
                    </div>
                    {isHomePage && <Footer />}
                </Fragment>
            </ThemeProvider>
        </SidebarProvider>
    );
};

export default App;