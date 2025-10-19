import { NavLink } from "react-router-dom";
import { Home, BookOpen, Users, Settings } from "lucide-react";

const nav = [
  { to: "/home", icon: Home, label: "Trang chủ" },
  { to: "/courses", icon: BookOpen, label: "Khoá học" },
  { to: "/users", icon: Users, label: "Người dùng" },
  { to: "/settings", icon: Settings, label: "Cài đặt" },
];

export default function Sidebar({ open }) {
  return (
    <aside
      className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100dvh-56px)] p-3 transition-[width] duration-200 ${
        open ? "w-60" : "w-[68px]"
      } overflow-hidden`}
    >
      <nav className="flex flex-col gap-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <Icon size={18} />
            <span className="whitespace-nowrap">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
