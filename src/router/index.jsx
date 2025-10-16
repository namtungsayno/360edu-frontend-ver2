import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

const LoginPage = lazy(() => import("pages/auth/LoginPage"));
const UserListPage = lazy(() => import("pages/user/UserListPage"));
const CourseListPage = lazy(() => import("pages/course/CourseListPage"));
const ClassListPage = lazy(() => import("pages/class/ClassListPage"));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{padding:16}}>Loading…</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/classes" element={<ClassListPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
