// src/router/index.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "router/ProtectedRoute";
import { ClassroomProvider } from "context/classroom/ClassroomContext";

import MainLayout from "layout/MainLayout";
import AuthLayout from "layout/AuthLayout";
import AdminDashboard from "pages/admin/AdminDashboard";

import { useAuth } from "context/auth/AuthContext";
import getLandingPath from "utils/getLandingPath";

// ================= AUTH & CORE =================
const LoginPage = lazy(() => import("pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("pages/auth/RegisterPage"));
const HomePage = lazy(() => import("pages/home/HomePage"));
const ReportsPage = lazy(() => import("pages/reports/ReportsPage"));
const SchedulePage = lazy(() => import("pages/schedule/SchedulePage")); // ✅ Lịch học

// ================= EXISTING =================
const UserListPage = lazy(() => import("pages/user/UserListPage"));
const CourseListPage = lazy(() => import("pages/course/CourseListPage"));
const ClassListPage = lazy(() => import("pages/class/ClassListPage"));
const ClassroomRoutes = lazy(() => import("./classroom/ClassroomRoutes"));
const TeacherProfilePublic = lazy(() =>
  import("pages/teachers/TeacherProfilePublic")
);

// ================= USER ACCOUNT =================
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

// ================= REDIRECT HELPERS =================
function HomeRedirect() {
  const { user } = useAuth();
  const to = getLandingPath(user);
  return <Navigate to={to} replace />;
}

function TeacherMeRedirect() {
  let meId = null;
  try {
    const raw = window.localStorage.getItem("auth_profile");
    if (raw) {
      const obj = JSON.parse(raw);
      meId = obj?.id ?? null;
    }
  } catch {
    meId = null;
  }
  return (
    <Navigate to={meId ? `/teachers/${meId}/profile` : "/auth/login"} replace />
  );
}

// ================= MAIN ROUTER =================
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
        <Routes>
          {/* COMMON AFTER LOGIN */}
          <Route path="/home" element={<HomeRedirect />} />
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* ========== AUTH AREA ========== */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* ========== APP AREA ========== */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              {/* (Không render HomePage trực tiếp nữa; dùng HomeRedirect ở trên) */}

              {/* ALL roles: Account self */}
              <Route path="/account/profile" element={<MyProfilePage />} />
              <Route
                path="/account/change-password"
                element={<ChangePasswordPage />}
              />

              {/* ========== ADMIN ONLY ========== */}
              <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
                {/* DASHBOARD */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* REPORTS */}
                <Route path="/reports" element={<ReportsPage />} />
                <Route
                  path="/admin/reports"
                  element={<Navigate to="/reports" replace />}
                />

                {/* USERS / TEACHERS quản trị */}
                <Route path="/admin/users" element={<UserListPage />} />
                <Route path="/admin/users/:id" element={<UserDetailPage />} />
                <Route path="/admin/teachers" element={<TeacherListPage />} />
                <Route
                  path="/admin/teachers/create"
                  element={<TeacherCreatePage />}
                />

                {/* tiện lợi: /admin -> dashboard */}
                <Route
                  path="/admin"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
              </Route>

              {/* ========== ADMIN or TEACHER ========== */}
              <Route
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_TEACHER"]} />
                }
              >
                {/* Hồ sơ GV */}
                <Route
                  path="/teachers/:userId/profile"
                  element={<TeacherProfileView />}
                />
                <Route
                  path="/teachers/:userId/preview"
                  element={<TeacherProfilePublic />}
                />

                {/* Học tập */}
                <Route path="/courses" element={<CourseListPage />} />
                <Route path="/classes" element={<ClassListPage />} />
                {/* ✅ Lịch học: đường riêng /schedule */}
                <Route path="/schedule" element={<SchedulePage />} />

                {/* Phòng học (rooms) */}
                <Route
                  path="/classrooms/*"
                  element={
                    <ClassroomProvider>
                      <ClassroomRoutes />
                    </ClassroomProvider>
                  }
                />
              </Route>

              {/* ========== TEACHER self ========== */}
              <Route element={<ProtectedRoute roles={["ROLE_TEACHER"]} />}>
                <Route
                  path="/teacher/me/profile/edit"
                  element={<TeacherProfileEdit />}
                />
                <Route
                  path="/teacher/me/profile"
                  element={<TeacherMeRedirect />}
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
