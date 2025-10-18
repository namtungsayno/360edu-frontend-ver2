// src/routes/classroom/ClassroomRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ClassroomListPage from "../../pages/classroom/ClassroomListPage";
import ClassroomForm from "../../pages/classroom/ClassroomForm";

export default function ClassroomRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="list" replace />} />
      <Route path="list" element={<ClassroomListPage />} />
      <Route path=":id/edit" element={<ClassroomForm />} />
      <Route path="new" element={<ClassroomForm />} />
    </Routes>
  );
}
