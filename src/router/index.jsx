// src/router/index.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "router/ProtectedRoute";
import { ClassroomProvider } from "context/classroom/ClassroomContext";

import MainLayout from "layout/MainLayout";
import AuthLayout from "layout/AuthLayout";

const LoginPage = lazy(() => import("pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("pages/auth/RegisterPage"));
const HomePage = lazy(() => import("pages/home/HomePage"));
const UserListPage = lazy(() => import("pages/user/UserListPage"));
const CourseListPage = lazy(() => import("pages/course/CourseListPage"));
const ClassListPage = lazy(() => import("pages/class/ClassListPage"));
const ClassroomRoutes = lazy(() => import("./classroom/ClassroomRoutes"));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
        <Routes>
          {/* root -> /auth/login */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* ------- AUTH AREA (dùng Outlet trong AuthLayout) ------- */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* ------- APP AREA SAU ĐĂNG NHẬP ------- */}
          {/* Guard cấp 1: phải đăng nhập */}
          <Route element={<ProtectedRoute />}>
            {/* Bọc layout app */}
            <Route element={<MainLayout />}>
              {/* Ai cũng dùng sau login */}
              <Route path="/home" element={<HomePage />} />

              {/* Chỉ ADMIN */}
              <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
                <Route path="/users" element={<UserListPage />} />
              </Route>

              {/* ADMIN hoặc TEACHER */}
              <Route
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_TEACHER"]} />
                }
              >
                <Route path="/courses" element={<CourseListPage />} />
                <Route path="/classes" element={<ClassListPage />} />
                <Route
                  path="/classrooms/*"
                  element={
                    <ClassroomProvider>
                      <ClassroomRoutes />
                    </ClassroomProvider>
                  }
                />
              </Route>
            </Route>
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
