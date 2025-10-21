// src/api/reports/reportsApi.js
import { http } from "api/http";

/** Helpers bắt nhiều shape dữ liệu khác nhau */
const arr = (x) => (Array.isArray(x) ? x : []);
const num = (x, d = 0) => (typeof x === "number" ? x : d);
const pick = (o, ...ks) => ks.find((k) => o && o[k] !== undefined);

/** Đếm theo role: chấp nhận 3 dạng BE:
 * 1) GET /users/count?role=ROLE_X -> { count }
 * 2) GET /users?role=ROLE_X&page=0&size=1 -> { page:{totalElements} } hoặc { totalElements }
 * 3) GET /users?role=ROLE_X -> Array -> length
 */
async function countByRole(role) {
  try {
    const { data } = await http.get("/users/count", { params: { role } });
    if (typeof data?.count === "number") return data.count;
  } catch {}
  try {
    const { data } = await http.get("/users", {
      params: { role, page: 0, size: 1 },
    });
    const total =
      pick(data || {}, "totalElements", "total", "count") ??
      data?.page?.totalElements;
    if (typeof total === "number") return total;
  } catch {}
  try {
    const { data } = await http.get("/users", { params: { role } });
    if (Array.isArray(data)) return data.length;
  } catch {}
  return 0;
}

/** KPI tổng quan cho trang Báo cáo (có thể dùng lại ở Dashboard) */
export async function fetchReportOverview() {
  const [students, parents, completedCourses, avgAttendance, monthlyRevenue] =
    await Promise.all([
      countByRole("ROLE_STUDENT"),
      countByRole("ROLE_PARENT"),
      // BE gợi ý: /reports/courses/completed?month=YYYY-MM
      http
        .get("/reports/courses/completed", { params: { month: undefined } })
        .catch(() => ({ data: {} })),
      // BE gợi ý: /reports/attendance/average?month=YYYY-MM
      http
        .get("/reports/attendance/average", { params: { month: undefined } })
        .catch(() => ({ data: {} })),
      // BE gợi ý: /finance/revenue/monthly?month=YYYY-MM
      http
        .get("/finance/revenue/monthly", { params: { month: undefined } })
        .catch(() => ({ data: {} })),
    ]);

  const totalLearners = num(students) + num(parents);
  const completed = num(pick(completedCourses.data || {}, "count", "total"));
  const avgAtt = num(pick(avgAttendance.data || {}, "rate", "value")); // %
  const revenue = pick(
    monthlyRevenue.data || {},
    "formatted",
    "amountFormatted",
    "amount"
  );

  return {
    totalLearners,
    completedCourses: completed || null,
    avgAttendance: avgAtt || null, // %
    revenueFormatted: revenue ?? null,
  };
}

/** Điểm danh theo lớp (cột) */
export async function fetchAttendanceByClass(params) {
  // BE gợi ý: /reports/attendance/by-class?from=2025-05&to=2025-10
  const { data } = await http
    .get("/reports/attendance/by-class", { params })
    .catch(() => ({ data: [] }));
  const list = arr(pick(data || {}, "items", "data", "list") || data);
  return list.map((i) => ({
    class: i.className ?? i.name ?? i.class ?? "Lớp",
    rate: num(i.rate ?? i.value ?? i.percent, 0),
  }));
}

/** Tiến độ học tập (line) theo tháng */
export async function fetchLearningProgress(params) {
  // BE gợi ý: /reports/learning-progress?from=2025-05&to=2025-10
  const { data } = await http
    .get("/reports/learning-progress", { params })
    .catch(() => ({ data: [] }));
  const list = arr(pick(data || {}, "items", "data", "list") || data);
  return list.map((i) => ({
    month: i.month ?? i.m,
    completed: num(i.completed ?? i.done ?? i.a, 0),
    inProgress: num(i.inProgress ?? i.progress ?? i.b, 0),
  }));
}

/** Tỷ trọng doanh thu theo khóa (pie) */
export async function fetchCourseRevenueMix(params) {
  // BE gợi ý: /finance/revenue/course-mix?from=2025-05&to=2025-10
  const { data } = await http
    .get("/finance/revenue/course-mix", { params })
    .catch(() => ({ data: [] }));
  const list = arr(pick(data || {}, "items", "data", "list") || data);
  return list.map((i) => ({
    name: i.name ?? i.courseName ?? "Khóa",
    value: num(i.value ?? i.percent ?? i.ratio, 0),
    color: i.color, // nếu BE trả
  }));
}

/** Doanh thu theo loại (bar) */
export async function fetchRevenueByType(params) {
  // BE gợi ý: /finance/revenue/by-type?from=...&to=...
  const { data } = await http
    .get("/finance/revenue/by-type", { params })
    .catch(() => ({ data: [] }));
  const list = arr(pick(data || {}, "items", "data", "list") || data);
  return list.map((i) => ({
    month: i.month ?? i.m,
    online: num(i.online ?? i.Online, 0),
    offline: num(i.offline ?? i.Offline, 0),
    video: num(i.video ?? i.Video, 0),
  }));
}

/** Danh sách báo cáo đã lưu */
export async function fetchSavedReports(params) {
  // BE gợi ý: /reports/saved
  const { data } = await http
    .get("/reports/saved", { params })
    .catch(() => ({ data: [] }));
  const list = arr(pick(data || {}, "items", "data", "list") || data);
  return list.map((i) => ({
    id: i.id ?? i.reportId,
    name: i.name ?? i.title,
    type: i.type ?? i.category ?? "general",
    date: i.date ?? i.createdAt?.slice(0, 10),
  }));
}
