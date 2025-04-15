import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../state/store.ts";
import {Navigate} from "react-router";
import {Outlet} from "react-router-dom";


const AdminGuardRoute = () => {
    const {user}=useSelector((state:RootState)=> state.auth);


    if (!user || !["ADMIN", "OWNER", "CO_OWNER"].includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
};

export default AdminGuardRoute;
