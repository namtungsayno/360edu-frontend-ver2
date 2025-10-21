// src/router/subject/SubjectRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SubjectManagement from "../../pages/subject/SubjectManagement";

export default function SubjectRoutes() {
  // Debug log
  console.log("✅ SubjectRoutes loaded!");
  
  return (
    <Routes>
      <Route index element={<SubjectManagement />} />
      <Route path="list" element={<SubjectManagement />} />
    </Routes>
  );
}