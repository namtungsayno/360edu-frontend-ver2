import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "components/common";

export default function HomePage() {
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
