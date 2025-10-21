// src/router/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "context/auth/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, initializing, user } = useAuth();
  const location = useLocation();

  // 1) Chờ khôi phục phiên để tránh nháy UI
  if (initializing) return <div style={{ padding: 16 }}>Loading…</div>;

  // 2) Chưa đăng nhập -> về login và lưu lại nơi đang đứng
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // 3) Nếu có yêu cầu role cụ thể
  if (roles) {
    const needed = Array.isArray(roles) ? roles : [roles];
    const normalize = (r) => (r?.startsWith("ROLE_") ? r : `ROLE_${r}`);
    const needSet = new Set(needed.map(normalize));

    const myRoles = (user.roles || []).map(normalize);
    const ok = myRoles.some((r) => needSet.has(r));

    if (!ok) {
      // Có thể Navigate về /home hoặc hiển thị 403
      return (
        <div className="container text-center mt-5">
          <h3>🚫 403 – Bạn không có quyền truy cập trang này</h3>
          <p className="text-slate-500 mt-2">
            Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là nhầm lẫn.
          </p>
        </div>
      );
      // Hoặc:
      // return <Navigate to="/home" replace />;
    }
  }

  // 4) Hợp lệ -> render nhánh con
  return <Outlet />;
}
