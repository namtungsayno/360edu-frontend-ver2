// src/router/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "context/auth/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, initializing, user } = useAuth();

  // Chờ khôi phục phiên để tránh nháy UI
  if (initializing) return <div style={{ padding: 16 }}>Loading…</div>;

  // Chưa đăng nhập → về login
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  // Yêu cầu role cụ thể
  if (roles?.length) {
    const ok = user?.roles?.some((r) => roles.includes(r));
    if (!ok) {
      return (
        <div className="container text-center mt-5">
          <h3>🚫 403 – Bạn không có quyền truy cập trang này</h3>
        </div>
      );
    }
  }

  return <Outlet />;
}
