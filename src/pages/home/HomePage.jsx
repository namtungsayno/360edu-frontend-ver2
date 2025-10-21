// src/pages/home/HomePage.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "components/layout/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="bg-white text-black min-h-full">
        <Outlet />
      </div>
    </MainLayout>
  );
}
