// src/router/index.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "router/ProtectedRoute";

import { ClassroomProvider } from "context/classroom/ClassroomContext";

const LoginPage = lazy(() => import("pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("pages/auth/RegisterPage"));
const HomePage = lazy(() => import("pages/home/HomePage"));
const UserListPage = lazy(() => import("pages/user/UserListPage"));
const CourseListPage = lazy(() => import("pages/course/CourseListPage"));
const ClassListPage = lazy(() => import("pages/class/ClassListPage"));
const ClassroomRoutes = lazy(() => import("./classroom/ClassroomRoutes"));
// (tuỳ chọn) nếu muốn dùng context cho module classroom
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Auth */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Ai cũng vào được sau khi login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
          </Route>

          {/* Chỉ ADMIN */}
          <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
            <Route path="/users" element={<UserListPage />} />
          </Route>

          {/* ADMIN hoặc TEACHER */}
          <Route
            element={<ProtectedRoute roles={["ROLE_ADMIN", "ROLE_TEACHER"]} />}
          >
            <Route path="/courses" element={<CourseListPage />} />
            <Route path="/classes" element={<ClassListPage />} />

            {/* 👇 Gắn module Classroom tại đây */}
            {/* Không dùng context? dùng thẳng */}
            {/* <Route path="/classrooms/*" element={<ClassroomRoutes />} /> */}

            {/* Dùng context để chia sẻ state toàn module */}
            <Route
              path="/classrooms/*"
              element={
                <ClassroomProvider>
                  <ClassroomRoutes />
                </ClassroomProvider>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
