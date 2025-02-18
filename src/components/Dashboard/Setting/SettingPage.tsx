import UserProfile from "./UserProfile.tsx";
import ChangePassword from "./ChangePassword.tsx";
import TwoFactorAuth from "./TwoFactorAuth.tsx";


const SettingPage = () => {
    return (
        <div className="container mx-auto max-w-4xl p-8">
            <UserProfile />
            <ChangePassword />
            <TwoFactorAuth/>
        </div>
    );
};

export default SettingPage;
