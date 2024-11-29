import CreateTimetable from "../components/Timetable/CreateTimetable.tsx";
import CancelTimetable from "../components/Timetable/CancelTimetable.tsx";
import ImportTimetable from "../components/Timetable/ImportTimetable.tsx";

import Dashboard from "../components/Dashboard/Dashboard.tsx";


const adminRoutes = [
    {
        path:'admin/hcmiu',
        children: [
            {
                path: 'timetable/create',
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
                path:'dashboard',
                element: <Dashboard/>

            }
        ]
    }
];

export default adminRoutes;
