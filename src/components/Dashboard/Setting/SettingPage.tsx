import UserProfile from "./UserProfile.tsx";
import ChangePassword from "./ChangePassword.tsx";


const SettingPage = () => {
    return (
        <div className="container mx-auto max-w-4xl p-8">
            <UserProfile />
            <ChangePassword />
        </div>
    );
};

export default SettingPage;
