import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Users,
  UserRound,
  Presentation,
  DollarSign,
  CalendarClock,
  BarChart3,
} from "lucide-react";

import {
  fetchOverview,
  fetchStudentsGrowth,
  fetchCourseMix,
  fetchRevenueByType,
  fetchTodaySchedule,
} from "api/stats/statsApi";

// --- UI atoms ---
const Card = ({ className = "", children }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}
  >
    {children}
  </div>
);
const CardHeader = ({ title, icon: Icon, action }) => (
  <div className="flex items-center justify-between p-5 border-b border-slate-100">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
          <Icon className="h-5 w-5 text-slate-600" />
        </div>
      )}
      <h3 className="text-slate-800 font-semibold">{title}</h3>
    </div>
    {action}
  </div>
);
const CardBody = ({ children, className = "" }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

// --- colors ---
const pieColors = ["#3b82f6", "#10b981", "#f59e0b"]; // blue-500, emerald-500, amber-500

export default function AdminDashboard() {
  // loading / error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // data states
  const [overview, setOverview] = useState(null);
  const [studentsGrowth, setStudentsGrowth] = useState([]);
  const [courseMix, setCourseMix] = useState([]);
  const [revenueByType, setRevenueByType] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);

  // fetch on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const [o, sg, cm, rev, sch] = await Promise.all([
          fetchOverview(),
          fetchStudentsGrowth({ from: "2025-01", to: "2025-06" }),
          fetchCourseMix(),
          fetchRevenueByType({ from: "2025-01", to: "2025-06" }),
          fetchTodaySchedule(),
        ]);
        if (!mounted) return;
        setOverview(o);
        setStudentsGrowth(sg);
        setCourseMix(cm);
        setRevenueByType(rev);
        setTodaySchedule(sch);
      } catch (ex) {
        if (!mounted) return;
        setError(ex.displayMessage || ex.message || "Không tải được dữ liệu");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const kpis = useMemo(() => {
    if (!overview) return [];
    return [
      {
        title: "Tổng số học viên",
        value: overview.totalStudents,
        trend: overview.studentsTrend,
        icon: Users,
      },
      {
        title: "Giáo viên",
        value: overview.totalTeachers,
        trend: overview.teachersTrend,
        icon: UserRound,
      },
      {
        title: "Lớp học hoạt động",
        value: overview.activeClasses,
        trend: overview.classesTrend,
        icon: Presentation,
      },
      {
        title: "Doanh thu tháng",
        value: overview.monthlyRevenueFormatted,
        trend: overview.revenueTrend,
        icon: DollarSign,
      },
    ];
  }, [overview]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {(loading ? Array.from({ length: 4 }) : kpis).map((k, idx) => (
          <Card key={idx}>
            <CardBody>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 w-36 bg-slate-100 rounded mb-3" />
                  <div className="h-8 w-24 bg-slate-100 rounded" />
                  <div className="h-3 w-40 bg-slate-100 rounded mt-3" />
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-500">{k.title}</p>
                    <p className="text-2xl font-semibold text-slate-800 mt-1">
                      {k.value ?? "N/A"}
                    </p>

                    <p className="text-emerald-600 text-sm mt-2">{k.trend}</p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center">
                    {k.icon && <k.icon className="h-5 w-5 text-slate-600" />}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Line chart: tăng trưởng học viên */}
        <Card className="xl:col-span-2">
          <CardHeader title="Tăng trưởng học viên" icon={BarChart3} />
          <CardBody className="h-72">
            {loading ? (
              <div className="h-full w-full animate-pulse bg-slate-50 rounded-xl" />
            ) : (
              // BỌC DIV có min size để tránh width/height = -1
              <div className="h-full min-h-[280px] min-w-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentsGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="m" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Pie: phân bổ khóa học */}
        <Card>
          <CardHeader title="Phân bổ khóa học" icon={BarChart3} />
          <CardBody className="h-72">
            {loading ? (
              <div className="h-full w-full animate-pulse bg-slate-50 rounded-xl" />
            ) : (
              <div className="h-full min-h-[260px] min-w-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseMix}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      label
                    >
                      {courseMix.map((_, i) => (
                        <Cell key={i} fill={pieColors[i % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Revenue + Schedule */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Bar: Doanh thu theo loại khóa */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Doanh thu theo loại khóa học (triệu VND)"
            icon={BarChart3}
          />
          <CardBody className="h-80">
            {loading ? (
              <div className="h-full w-full animate-pulse bg-slate-50 rounded-xl" />
            ) : (
              <div className="h-full min-h-[320px] min-w-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Online" fill="#3b82f6" />
                    <Bar dataKey="Offline" fill="#10b981" />
                    <Bar dataKey="Video" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Lịch học hôm nay */}
        <Card>
          <CardHeader title="Lịch học hôm nay" icon={CalendarClock} />
          <CardBody>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-50 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {todaySchedule.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{c.title}</p>
                      <p className="text-sm text-slate-500">
                        {c.teacher} • {c.mode}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-600">{c.time}</div>
                      <div className="text-xs text-slate-400">{c.room}</div>
                    </div>
                  </div>
                ))}
                {todaySchedule.length === 0 && (
                  <p className="text-slate-500">Hôm nay không có lịch nào.</p>
                )}
              </div>
            )}
            {error && (
              <p className="text-sm text-red-600 mt-3">
                Lỗi tải dữ liệu: {error}
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
