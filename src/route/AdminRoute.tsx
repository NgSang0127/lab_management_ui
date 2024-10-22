import CreateTimetable from "../components/Timetable/CreateTimetable.tsx";
import CancelTimetable from "../components/Timetable/CancelTimetable.tsx";

const adminRoutes = [
    {
        path: 'admin/timetable/create',
        element: <CreateTimetable/>,
    },
    {
        path: 'admin/timetable/cancel',
        element: <CancelTimetable/>,
    }
];

export default adminRoutes;
