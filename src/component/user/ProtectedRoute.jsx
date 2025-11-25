import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthstore } from "../../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthstore();
  if (!token) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
