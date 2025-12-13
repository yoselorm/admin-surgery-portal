import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { logoutUser } from '../redux/AuthSlice';
// import { clearAuthData } from '../Redux/AuthSlice';

const PrivateRoute = ({ redirectPath = '/' }) => {
    const {admin,accessToken}= useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    // More robust accessToken validation
    const isAuthenticated = Boolean(accessToken && accessToken.length > 0);

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(logoutUser());
        }
    }, [dispatch, isAuthenticated]);

    if (!isAuthenticated) {
        // Preserve the attempted URL for redirect after login
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;

