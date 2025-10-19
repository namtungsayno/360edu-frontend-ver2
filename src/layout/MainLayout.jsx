import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./parts/Header";
import Sidebar from "./parts/Sidebar";
import Footer from "./parts/Footer";
import PageTransition from "./PageTransition";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="grid grid-rows-[56px_1fr] min-h-dvh">
      <Header
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        theme={theme}
        onToggleTheme={() =>
          setTheme((t) => (t === "light" ? "dark" : "light"))
        }
      />
      <div className="grid grid-cols-[auto_1fr]">
        <Sidebar open={sidebarOpen} />
        <div className="p-4">
          <PageTransition>
            <Outlet />
          </PageTransition>
          <Footer />
        </div>
      </div>
    </div>
  );
}
