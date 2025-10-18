// src/pages/home/HomePage.jsx
import React from "react";
import { useAuth } from "context/auth/AuthContext";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // gọi BE xóa cookie + clear cache FE
      window.location.replace("/auth/login"); // điều hướng “cứng” để chặn back
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!user) {
    return (
      <div className="container text-center" style={{ marginTop: 80 }}>
        <h3>Bạn chưa đăng nhập!</h3>
        <a href="/auth/login" className="btn btn-primary mt-3">
          Đăng nhập ngay
        </a>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 800, marginTop: 60 }}>
      <div className="card shadow p-4 rounded-3">
        <h2 className="mb-3">Xin chào, {user.username} 👋</h2>
        <p>
          Email: <strong>{user.email}</strong>
        </p>
        <p>
          Quyền truy cập:{" "}
          {user.roles?.length ? user.roles.join(", ") : "Không có role"}
        </p>

        <hr />
        <h5 className="mt-3 mb-2">Danh mục</h5>
        <ul className="list-unstyled">
          {user.roles?.includes("ROLE_ADMIN") && (
            <li>
              <Link to="/users" className="text-decoration-none">
                👥 Quản lý người dùng
              </Link>
            </li>
          )}
          {["ROLE_ADMIN", "ROLE_TEACHER"].some((r) =>
            user.roles?.includes(r)
          ) && (
            <>
              <li>
                <Link to="/courses" className="text-decoration-none">
                  📚 Danh sách khóa học
                </Link>
              </li>
              <li>
                <Link to="/classes" className="text-decoration-none">
                  🏫 Danh sách lớp học
                </Link>
              </li>

              {/* ✅ Thêm link mới vào module Classroom */}
              <li>
                <Link to="/classrooms" className="text-decoration-none">
                  🏠 Danh sách phòng học (Classrooms)
                </Link>
              </li>
            </>
          )}
          {user.roles?.includes("ROLE_USER") &&
            !user.roles?.includes("ROLE_ADMIN") &&
            !user.roles?.includes("ROLE_TEACHER") && (
              <li>
                <span className="text-muted">
                  Không có quyền truy cập quản trị
                </span>
              </li>
            )}
        </ul>

        <div className="text-end mt-4">
          <button onClick={handleLogout} className="btn btn-danger">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
