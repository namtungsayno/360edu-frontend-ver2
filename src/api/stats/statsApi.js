// src/api/stats/statsApi.js
import { http } from "api/http";

/**
 * FE-only mode cho CHARTS (giữ giao diện test),
 * nhưng phần OVERVIEW (KPI) sẽ LUÔN cố lấy từ API thật nếu có.
 */
const USE_MOCK_FOR_CHARTS =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_USE_MOCK === "true") ||
  true; // mock charts cho tiện test UI

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/* -------------------- MOCK (CHARTS) -------------------- */
const mock = {
  studentsGrowth: [
    { month: "T1", value: 190 },
    { month: "T2", value: 210 },
    { month: "T3", value: 235 },
    { month: "T4", value: 265 },
    { month: "T5", value: 285 },
    { month: "T6", value: 330 },
  ],
  courseMix: [
    { name: "Online", value: 45 },
    { name: "Offline", value: 38 },
    { name: "Video", value: 17 },
  ],
  revenueByType: [
    { name: "T1", Online: 75, Offline: 45, Video: 30 },
    { name: "T2", Online: 82, Offline: 52, Video: 32 },
    { name: "T3", Online: 91, Offline: 60, Video: 35 },
    { name: "T4", Online: 98, Offline: 66, Video: 37 },
    { name: "T5", Online: 106, Offline: 72, Video: 40 },
    { name: "T6", Online: 118, Offline: 78, Video: 45 },
  ],
  todaySchedule: [
    {
      title: "Toán 10A1",
      teacher: "Nguyễn Văn X",
      time: "14:00",
      room: "P201",
      mode: "Offline",
    },
    {
      title: "Lý 11B2",
      teacher: "Trần Thị Y",
      time: "15:30",
      room: "P305",
      mode: "Offline",
    },
    {
      title: "Hóa 12C3",
      teacher: "Lê Văn Z",
      time: "16:00",
      room: "Online",
      mode: "Online",
    },
  ],
};
/* ------------------------------------------------------ */

/**
 * Hỗ trợ nhiều kiểu API đếm mà BE có thể đã triển khai.
 * Ưu tiên:
 *  1) /users/count?role=ROLE_XXX  -> { count: number }
 *  2) /users?role=ROLE_XXX&page=0&size=1 -> { page:{ totalElements } } hoặc { totalElements }
 *  3) /users?role=ROLE_XXX -> Array -> length
 */
async function getCountByRole(role) {
  // 1) /users/count?role=ROLE_XXX
  try {
    const { data } = await http.get("/users/count", { params: { role } });
    if (typeof data?.count === "number") return data.count;
  } catch (_) {}

  // 2) /users?role=...&page=0&size=1 (lấy totalElements)
  try {
    const { data } = await http.get("/users", {
      params: { role, page: 0, size: 1 },
    });
    const totalA = data?.page?.totalElements;
    const totalB = data?.totalElements;
    if (typeof totalA === "number") return totalA;
    if (typeof totalB === "number") return totalB;
  } catch (_) {}

  // 3) /users?role=... (đếm length)
  try {
    const { data } = await http.get("/users", { params: { role } });
    if (Array.isArray(data)) return data.length;
  } catch (_) {}

  // fallback nếu tất cả đều fail
  return 0;
}

/**
 * OVERVIEW thực tế:
 * - totalStudents = STUDENT + PARENT
 * - totalTeachers = TEACHER
 * - Các trend/enterprise KPI khác: để rỗng hoặc null khi chưa có.
 */
export async function fetchOverview() {
  // luôn cố gắng lấy thật
  const [teachers, students, parents] = await Promise.all([
    getCountByRole("ROLE_TEACHER"),
    getCountByRole("ROLE_STUDENT"),
    getCountByRole("ROLE_PARENT"),
  ]);

  return {
    totalStudents: (students || 0) + (parents || 0),
    totalTeachers: teachers || 0,
    activeClasses: null, // nếu bạn có API đếm lớp thì nối thêm như trên
    monthlyRevenueFormatted: null, // khi có API doanh thu thì set ở đây
    studentsTrend: "", // để trống vì bạn đang cần số thật, không ảo
    teachersTrend: "",
    classesTrend: "",
    revenueTrend: "",
  };
}

/* ---------------- charts (mock cho UI) ----------------- */
export async function fetchStudentsGrowth(params) {
  if (USE_MOCK_FOR_CHARTS) {
    await delay(150);
    return mock.studentsGrowth.map((i) => ({ m: i.month, v: i.value }));
  }
  const { data } = await http.get("/stats/students-growth", { params });
  return (data ?? []).map((i) => ({ m: i.month, v: i.value }));
}

export async function fetchCourseMix() {
  if (USE_MOCK_FOR_CHARTS) {
    await delay(120);
    return mock.courseMix;
  }
  const { data } = await http.get("/stats/course-mix");
  return data ?? [];
}

export async function fetchRevenueByType(params) {
  if (USE_MOCK_FOR_CHARTS) {
    await delay(120);
    return mock.revenueByType;
  }
  const { data } = await http.get("/stats/revenue-by-type", { params });
  return data ?? [];
}

export async function fetchTodaySchedule() {
  if (USE_MOCK_FOR_CHARTS) {
    await delay(120);
    return mock.todaySchedule;
  }
  const { data } = await http.get("/schedule/today");
  return data ?? [];
}

// Nếu sau này bạn có endpoint đếm lớp/ doanh thu, chỉ việc thêm:

// const classes = await getCountByRoleForClasses(); // ví dụ
// const revenue = await http.get("/finance/revenue/monthly");

// rồi gán vào activeClasses, monthlyRevenueFormatted.
