import {Link} from "react-router-dom";


const Home = () => {
    return (
        <nav className="px-2">
            <ul className="space-y-4">
                <li>
                    <Link to="admin/hcmiu/timetable/import">Import Timetable</Link>
                </li>
                <li>
                    <Link to="timetable/by-week">Get timetable By week</Link>
                </li>
                <li>
                    <Link to="admin/hcmiu/timetable/cancel">Cancel Timetable</Link>
                </li>
                <li>
                    <Link to="admin/hcmiu/timetable/create">Create Timetable</Link>
                </li>
            </ul>
        </nav>
    )
};

export default Home;
