import {createBrowserRouter} from "react-router-dom";
import App from "../App.tsx";
import SignIn from "../pages/auth/SignIn.tsx";
import SignUp from "../pages/auth/SignUp.tsx";
import Success from "../pages/email/Success.tsx";
import Error from "../pages/email/Error.tsx";
import teacherRoutes from "./TeacherRoute.tsx";
import adminRoutes from "./AdminRoute.tsx";
import Home from "../pages/home/Home.tsx";
import CardDetailsCourse from "../pages/timetable/CardDetailsCourse.tsx";
import Extracurricular from "../pages/timetable/Extracurricular.tsx";
import CheckEmail from "../pages/email/CheckEmail.tsx";
import ResetCodeInput from "../pages/auth/ResetCodeInput.tsx";
import ResetPassword from "../pages/auth/ResetPassword.tsx";
import ScheduleTable from "../pages/timetable/ScheduleTable.tsx";
import DashboardContent from "../pages/dashboard/DashboardContent.tsx";
import CreateTimetable from "../pages/timetable/CreateTimetable.tsx";
import UserNotificationCenter from "../components/Notification/UserNotificationCenter.tsx";
import SettingPage from "../pages/setting/SettingPage.tsx";
import Dashboard from "../pages/dashboard/Dashboard.tsx";
import AttendanceCheck from "../pages/attendance/AttendanceCheck.tsx";
import VerifyOtp from "../pages/auth/VerifyOtp.tsx";
import VerifyEmailOTP from "../pages/auth/VerifyEmailOTP.tsx";
import Events from "../pages/event/Event.tsx";
import Unauthorized from "../pages/error/Unauthorized.tsx";
import AboutUs from "../components/home/AboutUs.tsx";
import NotFound from "../pages/error/NotFound.tsx";
import InternalServerError from "../pages/error/InternalServerError.tsx";


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
                path: 'signin',
                element: <SignIn/>
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
                path: 'about-us',
                element: <AboutUs/>
            },
            {
                path: 'profile/dashboard',
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
                        path: 'events',
                        element: <Events/>
                    },
                    {
                        path: 'notification',
                        element: <UserNotificationCenter/>
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
                children: [
                    {
                        path: ':courseId/:NH/:TH?/:studyTime',
                        element: <CardDetailsCourse/>
                    },
                    {
                        path: ':timetableName',
                        element: <Extracurricular/>
                    }
                ]

            },
            {
                path: 'attendance',
                children: [
                    {
                        path: ':checkAttendance',
                        element: <AttendanceCheck/>
                    },
                ]

            },
            {
                path: 'unauthorized',
                element: <Unauthorized/>
            },
            {
                path: "email/check-email",
                element: <CheckEmail/>
            },
            {
                path: 'email/success',
                element: <Success/>,
            },
            {
                path: 'email/error',
                element: <Error/>
            },
        ]
    },
    {
        path: '/500',
        element: <InternalServerError/>
    },
    {
        path: '*',
        element: <NotFound/>
    },
]);

export default router;
