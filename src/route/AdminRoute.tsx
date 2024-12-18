import CreateTimetable from "../components/Timetable/CreateTimetable.tsx";
import CancelTimetable from "../components/Timetable/CancelTimetable.tsx";
import ImportTimetable from "../components/Timetable/ImportTimetable.tsx";

import Dashboard from "../components/Dashboard/Dashboard.tsx";
import DashboardContent from "../components/Dashboard/DashboardContent.tsx";
import SettingPage from "../components/Dashboard/Setting/SettingPage.tsx";
import UserManagement from "../components/Dashboard/UserManagement/UserManagement.tsx";


const adminRoutes = [
    {
        path:'admin/hcmiu',
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
                path:'timetable/cancel',
                element: <CancelTimetable/>
            },
            {
                path: 'timetable/import',
                element: <ImportTimetable/>
            },
            {
                path: 'setting',
                element: <SettingPage/>
            },
            {
                path:'user-management',
                element: <UserManagement/>
            }
        ]
    }
];

export default adminRoutes;
