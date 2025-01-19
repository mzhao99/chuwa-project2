import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth); 
  const userRole = user?.role; 

  useEffect(() => {
    if (!user || !token) {
      return navigate("/login");
    }
    if (requiredRole && userRole !== requiredRole) {
      navigate("/error", {
        state: { errMsg: "Access denied" },
      });
    }
  }, [navigate, userRole, requiredRole, token, user]);

  return <Outlet />;
};

export default ProtectedRoute;
