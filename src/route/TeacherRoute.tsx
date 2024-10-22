import Home from "../components/Home/Home.tsx";
import Calendar from "../components/Timetable/ScheduleTable.tsx";
import ImportTimetable from "../components/Timetable/ImportTimetable.tsx";
import CardDetailsCourse from "../components/Timetable/CardDetailsCourse.tsx";
import Extracurricular from "../components/Timetable/Extracurricular.tsx";

const teacherRoutes = [
    {
        index: true,
        element: <Home/>, // Home component as default child for teachers
    },
    {
        path: 'timetable/by-week',
        element: <Calendar/>,
    },
    {
        path: 'timetable/import',
        element: <ImportTimetable/>,
    },
    {
        path: 'courses/:courseId/:NH/:TH',
        element: <CardDetailsCourse/>,
    },
    {
        path: 'courses/:timetableName',
        element: <Extracurricular/>,
    }
];

export default teacherRoutes;
