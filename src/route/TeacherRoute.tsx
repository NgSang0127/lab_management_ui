import UserProfile from "../components/Profile/UserProfile.tsx";
import ProfileSettings from "../components/Profile/ProfileSettings.tsx";
import Profile from "../components/Profile/Profile.tsx";
import UserNotificationCenter from "../components/Notification/UserNotificationCenter.tsx";

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
                path: 'notification',
                element: <UserNotificationCenter/>
            },
            {
                path:'settings',
                element: <ProfileSettings/>
            },
        ]
    },
];

export default teacherRoutes;
