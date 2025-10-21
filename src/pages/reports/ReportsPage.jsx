import React, { useEffect, useState } from "react";
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
} from "recharts";
import {
  FileText,
  Download,
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  BarChart3,
} from "lucide-react";

import {
  fetchReportOverview,
  fetchAttendanceByClass,
  fetchLearningProgress,
  fetchCourseRevenueMix,
  fetchRevenueByType,
  fetchSavedReports,
} from "api/reports/reportsApi";

// --- UI atoms (giữ nguyên như trước) ---
const Card = ({ children }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
    {children}
  </div>
);
const CardHeader = ({ title, icon: Icon, children }) => (
  <div className="flex items-center justify-between p-4 border-b border-slate-100">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="h-5 w-5 text-slate-600" />}
      <h3 className="font-semibold text-slate-800">{title}</h3>
    </div>
    {children}
  </div>
);
const CardBody = ({ children }) => <div className="p-4">{children}</div>;
const Button = ({ children, variant = "default", onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
      variant === "outline"
        ? "border border-slate-300 text-slate-700 hover:bg-slate-50"
        : "bg-slate-900 text-white hover:bg-slate-800"
    }`}
  >
    {children}
  </button>
);
const ReportBadge = ({ type }) => {
  const map = {
    attendance: { text: "Điểm danh", cls: "bg-blue-100 text-blue-800" },
    learning: { text: "Học tập", cls: "bg-green-100 text-green-800" },
    financial: { text: "Tài chính", cls: "bg-orange-100 text-orange-800" },
    general: { text: "Tổng hợp", cls: "bg-purple-100 text-purple-800" },
  };
  const v = map[type] || map.general;
  return <span className={`text-xs px-2 py-1 rounded ${v.cls}`}>{v.text}</span>;
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [overview, setOverview] = useState({
    totalLearners: null,
    completedCourses: null,
    avgAttendance: null,
    revenueFormatted: null,
  });
  const [attendance, setAttendance] = useState([]);
  const [progress, setProgress] = useState([]);
  const [courseMix, setCourseMix] = useState([]);
  const [typeRevenue, setTypeRevenue] = useState([]);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const [ov, att, prog, mix, typeRev, savedRep] = await Promise.all([
          fetchReportOverview(),
          fetchAttendanceByClass({}), // thêm from/to nếu cần
          fetchLearningProgress({}),
          fetchCourseRevenueMix({}),
          fetchRevenueByType({}),
          fetchSavedReports({}),
        ]);
        if (!alive) return;
        setOverview(ov);
        setAttendance(att);
        setProgress(prog);
        setCourseMix(mix);
        setTypeRevenue(typeRev);
        setSaved(savedRep);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Không tải được dữ liệu báo cáo");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Báo cáo & Thống kê
          </h1>
          <p className="text-slate-500 mt-1">
            Xem và xuất các báo cáo hệ thống
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4" />
          Tạo báo cáo mới
        </Button>
      </div>

      {/* KPI */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            t: "Tổng học viên",
            v: overview.totalLearners ?? "N/A",
            s: "",
            icon: Users,
          },
          {
            t: "Khóa học hoàn thành",
            v: overview.completedCourses ?? "N/A",
            s: "Trong tháng này",
            icon: BookOpen,
          },
          {
            t: "Tỷ lệ điểm danh TB",
            v:
              overview.avgAttendance != null
                ? `${overview.avgAttendance}%`
                : "N/A",
            s: "Tháng này",
            icon: Calendar,
          },
          {
            t: "Doanh thu",
            v: overview.revenueFormatted ?? "N/A",
            s: "Tháng này",
            icon: DollarSign,
          },
        ].map((k) => (
          <Card key={k.t}>
            <CardBody>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 w-24 bg-slate-100 rounded mb-3" />
                  <div className="h-7 w-20 bg-slate-100 rounded" />
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">{k.t}</p>
                    <p className="text-2xl font-semibold text-slate-800 mt-1">
                      {k.v}
                    </p>
                    {k.s && (
                      <p className="text-slate-400 text-sm mt-2">{k.s}</p>
                    )}
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
                    <k.icon className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader title="Tiến độ học tập" icon={BarChart3}>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Xuất PDF
            </Button>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="h-[300px] bg-slate-50 rounded-lg animate-pulse" />
            ) : (
              <div className="h-[300px] min-w-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Hoàn thành"
                    />
                    <Line
                      type="monotone"
                      dataKey="inProgress"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Đang học"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Doanh thu theo khóa học" icon={BarChart3}>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Xuất PDF
            </Button>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="h-[300px] bg-slate-50 rounded-lg animate-pulse" />
            ) : (
              <div className="h-[300px] min-w-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseMix}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {courseMix.map((d, i) => (
                        <Cell
                          key={i}
                          fill={
                            d.color ||
                            ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][i % 4]
                          }
                        />
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

      {/* Attendance */}
      <Card>
        <CardHeader title="Báo cáo điểm danh theo lớp" icon={Users}>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Xuất PDF
          </Button>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="h-[400px] bg-slate-50 rounded-lg animate-pulse" />
          ) : (
            <div className="h-[400px] min-w-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="rate"
                    fill="#3b82f6"
                    name="Tỷ lệ điểm danh (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Saved reports */}
      <Card>
        <CardHeader title="Báo cáo đã lưu" icon={FileText} />
        <CardBody>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {saved.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-slate-100">
                      {r.type === "attendance" ? (
                        <Users className="h-5 w-5 text-blue-600" />
                      ) : r.type === "learning" ? (
                        <BookOpen className="h-5 w-5 text-green-600" />
                      ) : r.type === "financial" ? (
                        <DollarSign className="h-5 w-5 text-orange-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm">{r.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <ReportBadge type={r.type} />
                        <p className="text-xs text-slate-500">{r.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4" />
                      Tải xuống
                    </Button>
                    <Button variant="outline">Xem</Button>
                  </div>
                </div>
              ))}
              {saved.length === 0 && (
                <p className="text-slate-500">Chưa có báo cáo nào được lưu.</p>
              )}
            </div>
          )}
          {err && <p className="text-red-600 text-sm mt-3">{err}</p>}
        </CardBody>
      </Card>
    </div>
  );
}
