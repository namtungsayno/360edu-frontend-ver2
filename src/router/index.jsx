// src/router/index.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "router/ProtectedRoute";
import { ClassroomProvider } from "context/classroom/ClassroomContext";

import MainLayout from "layout/MainLayout";
import AuthLayout from "layout/AuthLayout";

// Auth & core
const LoginPage = lazy(() => import("pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("pages/auth/RegisterPage"));
const HomePage = lazy(() => import("pages/home/HomePage"));

// Existing
const UserListPage = lazy(() => import("pages/user/UserListPage"));
const CourseListPage = lazy(() => import("pages/course/CourseListPage"));
const ClassListPage = lazy(() => import("pages/class/ClassListPage"));
const ClassroomRoutes = lazy(() => import("./classroom/ClassroomRoutes"));
const TeacherProfilePublic = lazy(() =>
  import("pages/teachers/TeacherProfilePublic")
);

// User Account
const MyProfilePage = lazy(() => import("pages/account/MyProfilePage"));
const ChangePasswordPage = lazy(() =>
  import("pages/account/ChangePasswordPage")
);
const UserDetailPage = lazy(() => import("pages/user/UserDetailPage"));
const TeacherListPage = lazy(() => import("pages/teachers/TeacherListPage"));
const TeacherCreatePage = lazy(() =>
  import("pages/teachers/TeacherCreatePage")
);
const TeacherProfileView = lazy(() =>
  import("pages/teachers/TeacherProfileView")
);
const TeacherProfileEdit = lazy(() =>
  import("pages/teachers/TeacherProfileEdit")
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
        <Routes>
          {/* root -> /auth/login */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* AUTH AREA */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* APP AREA (sau login) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              {/* Common after login */}
              <Route path="/home" element={<HomePage />} />

              {/* ALL roles: Account self */}
              <Route path="/account/profile" element={<MyProfilePage />} />
              <Route
                path="/account/change-password"
                element={<ChangePasswordPage />}
              />

              {/* ADMIN only */}
              <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
                <Route path="/admin/users" element={<UserListPage />} />
                <Route path="/admin/users/:id" element={<UserDetailPage />} />
                <Route path="/admin/teachers" element={<TeacherListPage />} />
                <Route
                  path="/admin/teachers/create"
                  element={<TeacherCreatePage />}
                />
                {/* tiện lợi: /admin -> /admin/users */}
                <Route
                  path="/admin"
                  element={<Navigate to="/admin/users" replace />}
                />
              </Route>

              {/* ADMIN or TEACHER */}
              <Route
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_TEACHER"]} />
                }
              >
                <Route
                  path="/teachers/:userId/profile"
                  element={<TeacherProfileView />}
                />
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
              {/* ADMIN or TEACHER */}
              <Route
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_TEACHER"]} />
                }
              >
                <Route
                  path="/teachers/:userId/profile"
                  element={<TeacherProfileView />}
                />
                {/* NEW: preview read-only */}
                <Route
                  path="/teachers/:userId/preview"
                  element={<TeacherProfilePublic />}
                />
                {/* ...courses/classes/classrooms */}
              </Route>

              {/* TEACHER self */}
              <Route element={<ProtectedRoute roles={["ROLE_TEACHER"]} />}>
                <Route
                  path="/teacher/me/profile/edit"
                  element={<TeacherProfileEdit />}
                />
                {/* tiện lợi: /teacher/me/profile -> /teachers/:id/profile (view) */}
                <Route
                  path="/teacher/me/profile"
                  element={
                    <Navigate
                      to={`/teachers/${
                        window.localStorage.getItem("auth_profile")
                          ? JSON.parse(
                              window.localStorage.getItem("auth_profile")
                            ).id
                          : "me"
                      }/profile`}
                      replace
                    />
                  }
                />
              </Route>

              {/* tương thích đường cũ */}
              <Route
                path="/users"
                element={<Navigate to="/admin/users" replace />}
              />
            </Route>
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
