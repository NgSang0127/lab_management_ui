import CreateTimetable from "../components/Timetable/CreateTimetable.tsx";
import CancelTimetable from "../components/Timetable/CancelTimetable.tsx";
import ImportTimetable from "../components/Timetable/ImportTimetable.tsx";

import DashboardAdmin from "../components/Dashboard/DashboardAdmin.tsx";
import DashboardContent from "../components/Dashboard/DashboardContent.tsx";
import SettingPage from "../components/Dashboard/Setting/SettingPage.tsx";
import UserManagement from "../components/Dashboard/UserManagement/UserManagement.tsx";
import CategoryPage from "../components/Asset/CategoryPage.tsx";
import AssetPage from "../components/Asset/AssetPage.tsx";
import LocationPage from "../components/Asset/LocationPage.tsx";
import AssetDashboard from "../components/Asset/AssetDashboard.tsx";
import AssetManager from "../components/Asset/AssetManager.tsx";
import MaintenancePage from "../components/Asset/MaintenancePage.tsx";
import AssetImportExport from "../components/Asset/AssetImportExport.tsx";
import NotificationCenter from "../components/Notification/NotificationCenter.tsx";


const adminRoutes = [
    {
        path:'admin/hcmiu',
        element: <DashboardAdmin/>,
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
              path: 'notification',
              element: <NotificationCenter/>
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
            },
            {
                path:'asset-management',
                element: <AssetDashboard/>,
                children: [
                    {
                        path: 'asset',
                        element: <AssetPage/>
                    },
                    {
                        path: 'location',
                        element: <LocationPage/>
                    },
                    {
                        path: 'category',
                        element: <CategoryPage/>
                    },
                    {
                        path: 'manager',
                        element: <AssetManager/>
                    },
                    {
                        path:'maintenance',
                        element: <MaintenancePage/>
                    },
                    {
                        path:'import-export',
                        element: <AssetImportExport/>
                    },
                ]
            },

        ]
    }
];

export default adminRoutes;
