import UserProfile from "../components/Profile/UserProfile.tsx";
import Notification from "../components/Profile/Notification.tsx";
import ProfileSettings from "../components/Profile/ProfileSettings.tsx";
import Profile from "../components/Profile/Profile.tsx";

const teacherRoutes = [
    {
        path:'my-profile',
        element: <Profile/>,
        children:[
            {
              path:"",
              element: <UserProfile/>
            },
            {
                path:'notifications',
                element: <Notification/>
            },
            {
                path:'settings',
                element: <ProfileSettings/>
            },
        ]
    },
];

export default teacherRoutes;
