// src/router/index.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "router/ProtectedRoute";
import SubjectRoutes from "./subject/SubjectRoutes";

import { ClassroomProvider } from "context/classroom/ClassroomContext";
import { useAuth } from "context/auth/AuthContext";
import getLandingPath from "utils/getLandingPath";

// ===== Common UI (không dùng src/layout) =====
import { Sidebar } from "components/common";

// Main app layout: sidebar trái + nội dung phải
function MainLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="border-r">
        <Sidebar />
      </aside>
      <main className="p-6 bg-background text-foreground">
        <Outlet />
      </main>
    </div>
  );
}

// Auth layout đơn giản
function AuthLayout() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}

// ============ PAGES (lazy) ============
const LoginPage = lazy(() => import("pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("pages/auth/RegisterPage"));

const AdminDashboard = lazy(() => import("pages/admin/AdminDashboard"));
const ReportsPage = lazy(() => import("pages/reports/ReportsPage"));

const SchedulePage = lazy(() => import("pages/schedule/SchedulePage"));
const CourseListPage = lazy(() => import("pages/course/CourseListPage"));
const ClassListPage = lazy(() => import("pages/class/ClassListPage"));
const ClassroomRoutes = lazy(() => import("./classroom/ClassroomRoutes"));

const UserListPage = lazy(() => import("pages/user/UserListPage"));
const UserDetailPage = lazy(() => import("pages/user/UserDetailPage"));
const TeacherListPage = lazy(() => import("pages/teachers/TeacherListPage"));
const TeacherCreatePage = lazy(() =>
  import("pages/teachers/TeacherCreatePage")
);
const TeacherProfileView = lazy(() =>
  import("pages/teachers/TeacherProfileView")
);
const TeacherProfilePublic = lazy(() =>
  import("pages/teachers/TeacherProfilePublic")
);
const TeacherProfileEdit = lazy(() =>
  import("pages/teachers/TeacherProfileEdit")
);

const MyProfilePage = lazy(() => import("pages/account/MyProfilePage"));
const ChangePasswordPage = lazy(() =>
  import("pages/account/ChangePasswordPage")
);

// ===== Redirect helpers =====
function mapOldToHome(path) {
  return path
    .replace(/^\/admin\/dashboard$/, "/home/dashboard")
    .replace(/^\/admin\/users$/, "/home/users")
    .replace(/^\/admin\/users\//, "/home/users/")
    .replace(/^\/admin\/teachers$/, "/home/teachers")
    .replace(/^\/admin\/teachers\//, "/home/teachers/")
    .replace(/^\/reports$/, "/home/reports")
    .replace(/^\/schedule$/, "/home/schedule")
    .replace(/^\/courses$/, "/home/courses")
    .replace(/^\/classes$/, "/home/classes")
    .replace(
      /^\/classrooms(\/.*)?$/,
      (_m, rest) => `/home/classrooms${rest ?? ""}`
    );
}

function HomeRedirect() {
  const { user, initializing } = useAuth();
  if (initializing)
    return <div style={{ padding: 16 }}>Đang vào hệ thống…</div>;
  const raw = getLandingPath(user) || "/home/dashboard";
  const to = mapOldToHome(raw);
  return <Navigate to={to} replace />;
}

function TeacherMeRedirect() {
  let meId = null;
  try {
    const raw = window.localStorage.getItem("auth_profile");
    if (raw) meId = JSON.parse(raw)?.id ?? null;
  } catch {
    meId = null;
  }
  return (
    <Navigate to={meId ? `/teachers/${meId}/profile` : "/auth/login"} replace />
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
        <Routes>
          {/* Entry */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/home" element={<HomeRedirect />} />

          {/* ===== AUTH AREA ===== */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="login" replace />} />
            {/* cứ index thì hiển thị trang */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* ===== APP AREA (đã login) ===== */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              {/* Tài khoản (giữ nguyên đường cũ) */}
              <Route path="/account/profile" element={<MyProfilePage />} />
              <Route
                path="/account/change-password"
                element={<ChangePasswordPage />}
              />

              {/* ===== ADMIN ONLY dưới /home/* ===== */}
              <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
                <Route path="/home/dashboard" element={<AdminDashboard />} />

                {/* Users/Teachers quản trị */}
                <Route path="/home/users" element={<UserListPage />} />
                <Route path="/home/users/:id" element={<UserDetailPage />} />
                <Route path="/home/teachers" element={<TeacherListPage />} />
                <Route
                  path="/home/teachers/create"
                  element={<TeacherCreatePage />}
                />

                {/* Reports */}
                <Route path="/home/reports" element={<ReportsPage />} />

                {/* Subject module */}
                <Route path="/home/subject/*" element={<SubjectRoutes />} />
              </Route>

              {/* ===== ADMIN or TEACHER ===== */}
              <Route
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_TEACHER"]} />
                }
              >
                {/* Lịch học / Khoá / Lớp */}
                <Route path="/home/schedule" element={<SchedulePage />} />
                <Route path="/home/courses" element={<CourseListPage />} />
                <Route path="/home/classes" element={<ClassListPage />} />

                {/* Phòng học */}
                <Route
                  path="/home/classrooms/*"
                  element={
                    <ClassroomProvider>
                      <ClassroomRoutes />
                    </ClassroomProvider>
                  }
                />

                {/* Hồ sơ giáo viên */}
                <Route
                  path="/teachers/:userId/profile"
                  element={<TeacherProfileView />}
                />
                <Route
                  path="/teachers/:userId/preview"
                  element={<TeacherProfilePublic />}
                />
              </Route>

              {/* ===== TEACHER self ===== */}
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

              {/* Redirect tương thích cũ → mới (an toàn, tránh 404) */}
              <Route
                path="/admin/dashboard"
                element={<Navigate to="/home/dashboard" replace />}
              />
              <Route
                path="/admin/users"
                element={<Navigate to="/home/users" replace />}
              />
              <Route
                path="/admin/users/:id"
                element={<Navigate to="/home/users/:id" replace />}
              />
              <Route
                path="/admin/teachers"
                element={<Navigate to="/home/teachers" replace />}
              />
              <Route
                path="/admin/teachers/create"
                element={<Navigate to="/home/teachers/create" replace />}
              />
              <Route
                path="/reports"
                element={<Navigate to="/home/reports" replace />}
              />
              <Route
                path="/schedule"
                element={<Navigate to="/home/schedule" replace />}
              />
              <Route
                path="/courses"
                element={<Navigate to="/home/courses" replace />}
              />
              <Route
                path="/classes"
                element={<Navigate to="/home/classes" replace />}
              />
              <Route
                path="/classrooms/*"
                element={<Navigate to="/home/classrooms" replace />}
              />
              <Route
                path="/admin"
                element={<Navigate to="/home/dashboard" replace />}
              />
              <Route
                path="/users"
                element={<Navigate to="/home/users" replace />}
              />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
