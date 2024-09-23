import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {Provider} from 'react-redux';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App.tsx';
import {ThemeContextProvider} from './theme/ThemeContext.tsx';
import Home from './components/Home/Home.tsx';
import SignIn from "./components/Auth/SignIn.tsx";
import SignUp from "./components/Auth/SignUp.tsx";
import {store} from "./state/store.ts";
import Success from "./components/Email/Success.tsx";
import Error from "./components/Email/Error.tsx";
import Calendar from "./components/Timetable/ScheduleTable.tsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>, // Main layout or wrapper component
        children: [
            {
                index: true,
                element: <Home/>, // Home component as default child
            },
            {
                path: 'account/signin',
                element: <SignIn/>,
            },
            {
                path: 'account/signup',
                element: <SignUp/>,
            },
            {
                path:'timetable/by-week',
                element: <Calendar/>
            }
        ],


    }
    ,
    {
        path: "/success",
        element: <Success/>,
    },
    {
        path: "/error",
        element: <Error/>
    }

]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>

            <ThemeContextProvider>

                <RouterProvider router={router}/>
            </ThemeContextProvider>
        </Provider>
    </StrictMode>
);
