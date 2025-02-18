import {createBrowserRouter} from "react-router-dom";
import App from "../App.tsx";
import SignIn from "../components/Auth/SignIn.tsx";
import SignUp from "../components/Auth/SignUp.tsx";
import Success from "../components/Email/Success.tsx";
import Error from "../components/Email/Error.tsx";
import teacherRoutes from "./TeacherRoute.tsx";
import adminRoutes from "./AdminRoute.tsx";
import Home from "../components/Home/Home.tsx";


import CardDetailsCourse from "../components/Timetable/CardDetailsCourse.tsx";
import Extracurricular from "../components/Timetable/Extracurricular.tsx";
import CheckEmail from "../components/Email/CheckEmail.tsx";
import ResetCodeInput from "../components/Auth/ResetCodeInput.tsx";
import ResetPassword from "../components/Auth/ResetPassword.tsx";
import ScheduleTable from "../components/Timetable/Schedule/ScheduleTable.tsx";
import DashboardAdmin from "../components/Dashboard/DashboardAdmin.tsx";
import DashboardContent from "../components/Dashboard/DashboardContent.tsx";
import CreateTimetable from "../components/Timetable/CreateTimetable.tsx";
import NotificationCenter from "../components/Notification/NotificationCenter.tsx";
import SettingPage from "../components/Dashboard/Setting/SettingPage.tsx";
import Dashboard from "../components/Dashboard/Dashboard.tsx";
import AttendanceCheck from "../components/Attendance/AttendanceCheck.tsx";
import VerifyOtp from "../components/Auth/VerifyOtp.tsx";
import VerifyEmailOTP from "../components/Auth/VerifyEmailOTP.tsx";


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
                element: <ScheduleTable/>,
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
                path: 'account/verify',
                element: <VerifyOtp/>
            },
            {
                path: 'account/verify-email',
                element: <VerifyEmailOTP/>
            },
            {
                path:'profile/dashboard',
                element: <Dashboard/>,
                children: [
                    {
                        path: "",
                        element: <DashboardContent/>
                    },
                    {
                        path: 'book',
                        element: <CreateTimetable/>
                    },
                    {
                        path: 'notification',
                        element: <NotificationCenter/>
                    },
                    {
                        path: 'setting',
                        element: <SettingPage/>
                    },
                    {
                        path: 'by-week',
                        element: <ScheduleTable/>,
                    },
                    ]
            },
            {
                path: 'courses',
                children:[
                    {
                        path:':courseId/:NH/:TH?/:studyTime',
                        element: <CardDetailsCourse/>
                    },
                    {
                        path:':timetableName',
                        element: <Extracurricular/>
                    }
                ]

            },
            {
                path: 'attendance',
                children:[
                    {
                        path:':checkAttendance',
                        element: <AttendanceCheck/>
                    },
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
