import {Link} from "react-router-dom";


const Home = () => {
    return (
        <nav className="px-2">
            <ul className="space-y-4">
                <li>
                    <Link to="timetable/import">Import Timetable</Link>
                </li>
                <li>
                    <Link to="timetable/by-week">Get timetable By week</Link>
                </li>
                <li>
                    <Link to="admin/timetable/cancel">Cancel Timetable</Link>
                </li>
                <li>
                    <Link to="admin/timetable/create">Create Timetable</Link>
                </li>
            </ul>
        </nav>
    )
};

export default Home;
