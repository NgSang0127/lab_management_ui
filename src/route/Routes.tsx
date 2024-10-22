import {createBrowserRouter} from "react-router-dom";
import App from "../App.tsx";
import SignIn from "../components/Auth/SignIn.tsx";
import SignUp from "../components/Auth/SignUp.tsx";
import Success from "../components/Email/Success.tsx";
import Error from "../components/Email/Error.tsx";
import teacherRoutes from "./TeacherRoute.tsx";
import adminRoutes from "./AdminRoute.tsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            ...teacherRoutes,
            ...adminRoutes,
            {
                path: 'account/signin',
                element: <SignIn/>,
            },
            {
                path: 'account/signup',
                element: <SignUp/>,
            }
        ]
    },
    {
        path: '/success',
        element: <Success/>,
    },
    {
        path: '/error',
        element: <Error/>
    },
    {
        path: '*',
        element: <div>404 Not Found</div>,
    },
]);

export default router;
