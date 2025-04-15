import ProfileNavigation from "./ProfileNavigation";
import { Link } from "react-router-dom";

const Profile = () => {
    return (
        <div className="lg:flex justify-between">
            <div className="sticky h-[80vh] lg:w-[20%]">
                <ProfileNavigation open={false} handleClose={() => {}} />
            </div>
            <div className="lg:w-[80%]">
                <Link to="/"></Link>
            </div>
        </div>
    );
};

export default Profile;
