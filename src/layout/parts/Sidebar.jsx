import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home as HomeIcon,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  BarChart3,
  DoorOpen,
} from "lucide-react";
import { useAuth } from "context/auth/AuthContext";
import getLandingPath from "utils/getLandingPath";

export default function Sidebar({ open = true }) {
  const location = useLocation();
  const { user } = useAuth();
  const roles = user?.roles || [];
  const isAdmin = roles.includes("ROLE_ADMIN");
  const isTeacher = roles.includes("ROLE_TEACHER");

  // ===== Menu groups (khớp router hiện có) =====
  const groups = useMemo(() => {
    const landing = getLandingPath(user);

    const g = [
      {
        title: "Tổng quan",
        items: [
          // Admin: hiện Dashboard
          isAdmin && {
            label: "Dashboard",
            icon: LayoutDashboard,
            to: "/admin/dashboard",
          },
          // Non-admin: có nút Trang chủ (điểm hạ cánh theo role)
          !isAdmin && {
            label: "Trang chủ",
            icon: HomeIcon,
            to: landing,
          },
        ].filter(Boolean),
      },
      {
        title: "Quản lý người dùng",
        items: [
          isAdmin && { label: "Người dùng", icon: Users, to: "/admin/users" },
          isTeacher &&
            user?.id && {
              label: "Hồ sơ GV",
              icon: GraduationCap,
              to: `/teachers/${user.id}/profile`,
            },
        ].filter(Boolean),
      },
      {
        title: "Quản lý học tập",
        items: [
          (isAdmin || isTeacher) && {
            label: "Lịch học",
            icon: Calendar,
            to: "/schedule",
          },
          (isAdmin || isTeacher) && {
            label: "Lớp học",
            icon: GraduationCap,
            to: "/classrooms",
          },
          (isAdmin || isTeacher) && {
            label: "Khóa học",
            icon: BookOpen,
            to: "/courses",
          },
        ].filter(Boolean),
      },
      {
        title: "Tài chính & Báo cáo",
        items: [
          // Khi có route thật: { label: "Thanh toán", icon: CreditCard, to: "/payment" }
          { label: "Báo cáo", icon: BarChart3, to: "/reports" },
        ],
      },
      {
        title: "Hệ thống",
        items: [{ label: "Phòng học", icon: DoorOpen, to: "/classrooms" }],
      },
    ];

    return g.filter((grp) => grp.items.length > 0);
  }, [isAdmin, isTeacher, user]);

  return (
    <aside
      className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100dvh-56px)] p-3 transition-[width] duration-200 ${
        open ? "w-60" : "w-[68px]"
      } overflow-hidden flex flex-col`}
    >
      {/* Header */}
      <div className="border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo-360edu.png"
            alt="360edu Logo"
            className="h-9 w-auto"
          />
          {open && (
            <div>
              <h2 className="font-semibold">360edu</h2>
              <p className="text-xs text-slate-500">Admin Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {groups.map((grp) => (
          <div key={grp.title} className="mb-3">
            {open && (
              <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {grp.title}
              </div>
            )}
            <ul className="space-y-1">
              {grp.items.map((it) => {
                const active = location.pathname.startsWith(it.to);
                const Icon = it.icon;
                return (
                  <li key={it.to}>
                    <NavLink
                      to={it.to}
                      title={!open ? it.label : undefined}
                      className={[
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                        active
                          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {open && <span className="truncate">{it.label}</span>}
                      {active && (
                        <span
                          aria-hidden
                          className="ml-auto h-5 w-1 rounded-full bg-sky-500"
                        />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
