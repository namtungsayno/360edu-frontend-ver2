import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../common/Sidebar";

const MainLayout = () => {
  const location = useLocation();
  
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-black">360edu Admin Portal</h1>
              <p className="text-sm text-gray-600">Hệ thống quản lý giáo dục</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span>Xin chào, Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - This will contain nested routes */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
