import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userRole = useSelector((state) => state.user.role); // set up role in redux store

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/error" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
