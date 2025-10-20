import { NavLink } from "react-router-dom";
import {
  Home,
  BookOpen,
  Users,
  Settings,
  User,
  GraduationCap,
  Pencil,
} from "lucide-react";
import { useAuth } from "context/auth/AuthContext";

export default function Sidebar({ open }) {
  const { user } = useAuth();
  const roles = user?.roles || [];
  const isAdmin = roles.includes("ROLE_ADMIN");
  const isTeacher = roles.includes("ROLE_TEACHER");

  const items = [
    { to: "/home", icon: Home, label: "Trang chủ" },
    { to: "/account/profile", icon: User, label: "Hồ sơ của tôi" },
    ...(isAdmin || isTeacher
      ? [{ to: "/courses", icon: BookOpen, label: "Khoá học" }]
      : []),
    ...(isAdmin
      ? [
          { to: "/admin/users", icon: Users, label: "Người dùng" },
          { to: "/admin/teachers", icon: GraduationCap, label: "Giáo viên" },
        ]
      : []),
    // Teacher chỉ còn "Hồ sơ GV" (không còn "Sửa hồ sơ GV")
    ...(isTeacher
      ? [
          {
            to: `/teachers/${user.id}/profile`,
            icon: GraduationCap,
            label: "Hồ sơ GV",
          },
        ]
      : []),
    { to: "/settings", icon: Settings, label: "Cài đặt" },
  ];

  return (
    <aside
      className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100dvh-56px)] p-3 transition-[width] duration-200 ${
        open ? "w-60" : "w-[68px]"
      } overflow-hidden`}
    >
      <nav className="flex flex-col gap-1">
        {items.map(({ to, icon: Icon, label }) => (
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
