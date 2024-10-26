import CreateTimetable from "../components/Timetable/CreateTimetable.tsx";
import CancelTimetable from "../components/Timetable/CancelTimetable.tsx";
import ImportTimetable from "../components/Timetable/ImportTimetable.tsx";


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
            }
        ]
    }
];

export default adminRoutes;
