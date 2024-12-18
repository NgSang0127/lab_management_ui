import {createBrowserRouter} from "react-router-dom";
import App from "../App.tsx";
import SignIn from "../components/Auth/SignIn.tsx";
import SignUp from "../components/Auth/SignUp.tsx";
import Success from "../components/Email/Success.tsx";
import Error from "../components/Email/Error.tsx";
import teacherRoutes from "./TeacherRoute.tsx";
import adminRoutes from "./AdminRoute.tsx";
import Home from "../components/Home/Home.tsx";
import Calendar from "../components/Timetable/ScheduleTable.tsx";

import CardDetailsCourse from "../components/Timetable/CardDetailsCourse.tsx";
import Extracurricular from "../components/Timetable/Extracurricular.tsx";
import CheckEmail from "../components/Email/CheckEmail.tsx";
import ResetCodeInput from "../components/Auth/ResetCodeInput.tsx";
import ResetPassword from "../components/Auth/ResetPassword.tsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            ...teacherRoutes,
            ...adminRoutes,
            {
                index: true,
                element: <Home/>,
            },
            {
                path: 'timetable/by-week',
                element: <Calendar/>,
            },
            {
                path: 'account/signin',
                element: <SignIn/>,
            },
            {
              path: 'account/reset-code',
              element: <ResetCodeInput/>
            },
            {
                path: 'account/signup',
                element: <SignUp/>,
            },
            {
                path: 'account/reset-password',
                element: <ResetPassword/>
            },
            {
                path: 'courses',
                children:[
                    {
                        path:':courseId/:NH/:TH/:studyTime',
                        element: <CardDetailsCourse/>
                    },
                    {
                        path:':timetableName',
                        element: <Extracurricular/>
                    }
                ]

            },
            {
                path:"check-email",
                element: <CheckEmail/>
            },
            {
                path: 'success',
                element: <Success/>,
            },
            {
                path: 'error',
                element: <Error/>
            },
        ]
    },

    {
        path: '*',
        element: <div>404 Not Found</div>,
    },
]);

export default router;
