import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "context/auth/AuthContext";
import { hasAnyRole } from "utils/roles";

export default function RequireRoles({ roles = [], children }) {
  const { roles: myRoles, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasAnyRole(myRoles, roles)) return <Navigate to="/403" replace />;
  return children;
}
