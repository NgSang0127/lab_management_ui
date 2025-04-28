import CreateTimetable from "../pages/timetable/CreateTimetable.tsx";
import CancelTimetable from "../pages/timetable/CancelTimetable.tsx";
import ImportTimetable from "../pages/timetable/ImportTimetable.tsx";
import DashboardAdmin from "../pages/dashboard/DashboardAdmin.tsx";
import DashboardContent from "../pages/dashboard/DashboardContent.tsx";
import SettingPage from "../pages/setting/SettingPage.tsx";
import UserManagement from "../pages/userManagement/UserManagement.tsx";
import Category from "../pages/asset/Category.tsx";
import Asset from "../pages/asset/Asset.tsx";
import Location from "../pages/asset/Location.tsx";
import AssetDashboard from "../pages/asset/AssetDashboard.tsx";
import AssetManager from "../pages/asset/AssetHistoryManagement.tsx";
import Maintenance from "../pages/asset/Maintenance.tsx";
import AssetImportExport from "../pages/asset/AssetImportExport.tsx";
import AdminNotificationCenter from "../pages/notification/AdminNotificationCenter.tsx";
import Events from "../pages/event/Event.tsx";
import AdminGuardRoute from "./AdminGuardRoute.tsx";
import Room from "../pages/asset/Room.tsx";
import Software from "../pages/asset/Software.tsx";
import AssetBorrowingManagement from "../pages/asset/AssetBorrowingManagement.tsx";
import UserAssetManagement from "../pages/asset/UserAssetManagement.tsx";
import Semester from "../pages/semester/Semester.tsx";
import CreateTimetableAdmin from "../pages/semester/CreateTimetableAdmin.tsx";
import TimetableManager from "../pages/semester/TimetableManager.tsx";
import TimetableDashboard from "../pages/semester/TimetableDashboard.tsx";


const adminRoutes = [
    {
        path: 'admin/hcmiu',
        element: <AdminGuardRoute/>,
        children: [
            {
                path: "",
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
                        path: 'timetable/cancel',
                        element: <CancelTimetable/>
                    },
                    {
                        path: 'events',
                        element: <Events/>
                    },
                    {
                        path: 'notification',
                        element: <AdminNotificationCenter/>
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
                        path: 'user-management',
                        element: <UserManagement/>
                    },
                    {
                        path: 'asset-management',
                        element: <AssetDashboard/>,
                        children: [
                            {
                                path: 'asset',
                                element: <Asset/>
                            },
                            {
                                path: 'location',
                                element: <Location/>
                            },
                            {
                                path: 'category',
                                element: <Category/>
                            },
                            {
                                path: 'manager',
                                element: <AssetManager/>
                            },
                            {
                                path: 'maintenance',
                                element: <Maintenance/>
                            },
                            {
                                path: 'room',
                                element: <Room/>
                            },
                            {
                                path: 'borrow',
                                element: <AssetBorrowingManagement/>
                            },
                            {
                                path: 'software',
                                element: <Software/>
                            },
                            {
                                path: 'asset-user',
                                element: <UserAssetManagement/>
                            },
                            {
                                path: 'import-export',
                                element: <AssetImportExport/>
                            },
                        ]
                    },
                    {
                        path: 'timetable-management',
                        element: <TimetableDashboard/>,
                        children: [
                            {
                                path: 'timetable',
                                element: <TimetableManager/>
                            },
                            {
                                path:'semester',
                                element: <Semester/>
                            }
                        ]
                    }
                ]
            },
        ]
    }
];

export default adminRoutes;
