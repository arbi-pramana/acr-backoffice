import { Navigate } from "react-router-dom";
import React from "react";
import { isAuthenticated } from "./is-authenticated";

const ProtectedRoute = (props: { children: React.ReactNode }) => {
  const loggedIn = isAuthenticated();
  console.log("ProtectedRoute", loggedIn);

  return loggedIn ? props.children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
