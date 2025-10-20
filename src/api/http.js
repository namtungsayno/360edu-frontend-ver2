// src/api/http.js
import axios from "axios";

// 1) Tạo instance http (phải ở TRƯỚC khối MOCK)
export const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  withCredentials: true, // QUAN TRỌNG: gửi cookie JWT kèm request
  headers: { "Content-Type": "application/json" },
});

// 2) Interceptors
http.interceptors.request.use((config) => config);

http.interceptors.response.use(
  (res) => res,
  (err) => {
    err.displayMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Có lỗi xảy ra";
    return Promise.reject(err);
  }
);

console.log("Axios initialized, baseURL =", http.defaults.baseURL);
console.log("MOCK =", process.env.REACT_APP_USE_MOCK === "true");

// =========================
// 3) MOCK API (đặt SAU khi đã tạo http)
//    Bật bằng .env: REACT_APP_USE_MOCK=true
// =========================
if (process.env.REACT_APP_USE_MOCK === "true") {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // Giữ tham chiếu method gốc — dùng khi không mock endpoint đó
  const realGet = http.get.bind(http);
  const realPost = http.post.bind(http);
  const realPut =
    http.put?.bind(http) || (() => Promise.reject(new Error("PUT not bound")));
  const realPatch =
    http.patch?.bind(http) ||
    (() => Promise.reject(new Error("PATCH not bound")));
  const realDelete =
    http.delete?.bind(http) ||
    (() => Promise.reject(new Error("DELETE not bound")));

  // =========================
  // In-memory DB cho Classroom (giữ theo file cũ)
  // =========================
  let CLASSROOMS = [
    { id: 1, name: "Lớp 10A1", capacity: 30, active: true, status: "ACTIVE" },
    { id: 2, name: "Lớp 11A2", capacity: 35, active: true, status: "ACTIVE" },
    {
      id: 3,
      name: "Physics Lab",
      capacity: 25,
      active: false,
      status: "INACTIVE",
    },
  ];
  let nextClassroomId = 4;

  // Helper lấy id classroom từ URL: "/classrooms/123" -> "123"
  const getClassroomIdFromUrl = (url) => {
    const m = url.match(/\/classrooms\/(.+?)(?:\/|$)/);
    return m ? m[1] : null;
  };

  // =========================
  // In-memory DB cho Users/Teachers (NEW)
  // =========================
  let USERS = [
    {
      id: 1,
      username: "admin",
      fullName: "System Admin",
      email: "admin@demo.com",
      phone: "0900000001",
      roles: ["ROLE_ADMIN"],
      enabled: true,
      password: "123",
    },
    {
      id: 2,
      username: "t.hanh",
      fullName: "Cô Hạnh",
      email: "hanh@demo.com",
      phone: "0900000002",
      roles: ["ROLE_TEACHER"],
      enabled: true,
      password: "123",
    },
    {
      id: 3,
      username: "t.long",
      fullName: "Thầy Long",
      email: "long@demo.com",
      phone: "0900000003",
      roles: ["ROLE_TEACHER"],
      enabled: true,
      password: "123",
    },
    {
      id: 4,
      username: "stu.minh",
      fullName: "Minh Nguyễn",
      email: "minh@demo.com",
      phone: "0900000004",
      roles: ["ROLE_STUDENT"],
      enabled: true,
      password: "123",
    },
    {
      id: 5,
      username: "p.lan",
      fullName: "PH Lan",
      email: "lan@demo.com",
      phone: "0900000005",
      roles: ["ROLE_PARENT"],
      enabled: true,
      password: "123",
    },
  ];
  let TEACHER_PROFILES = {
    2: {
      id: 1002,
      userId: 2,
      bio: "8 năm dạy Toán & Anh",
      subjects: "Math,English",
      yearsExperience: 8,
      avatarUrl: "",
    },
    3: {
      id: 1003,
      userId: 3,
      bio: "5 năm Lý nâng cao",
      subjects: "Physics",
      yearsExperience: 5,
      avatarUrl: "",
    },
  };
  let nextUserId = 6;
  let nextTeacherProfileId = 1100;

  // -------------------
  // POST (login/logout + classroom create + users actions)
  // -------------------
  http.post = async (url, data, cfg) => {
    // ===== AUTH LOGIN (mock)
    if (url === "/auth/login") {
      await delay(400);
      const { username, password } = data || {};
      const found = USERS.find(
        (u) => u.username === username && u.password === password && u.enabled
      );
      if (found) {
        // lưu profile để /auth/me đọc lại
        const profile = {
          id: found.id,
          username: found.username,
          email: found.email,
          fullName: found.fullName,
          roles: found.roles,
        };
        localStorage.setItem("auth_profile", JSON.stringify(profile));
        return { data: profile };
      }
      const error = new Error("Unauthorized");
      error.response = {
        status: 401,
        data: { message: "Tài khoản hoặc mật khẩu không đúng" },
      };
      throw error;
    }

    // AUTH LOGOUT (mock)
    if (url === "/auth/logout") {
      await delay(200);
      localStorage.removeItem("auth_profile");
      return { data: { ok: true } };
    }

    // ===== USERS: Change Password (self) (NEW)
    if (/^\/users\/\d+\/change-password$/.test(url)) {
      await delay(250);
      const id = Number(url.match(/\/users\/(\d+)\/change-password$/)[1]);
      const u = USERS.find((x) => x.id === id);
      if (!u) {
        const e = new Error("Not Found");
        e.response = { status: 404, data: { message: "User not found" } };
        throw e;
      }
      if (!data?.currentPassword || data.currentPassword !== u.password) {
        const e = new Error("Invalid");
        e.response = {
          status: 400,
          data: { message: "Mật khẩu hiện tại không đúng" },
        };
        throw e;
      }
      if (!data?.newPassword || String(data.newPassword).length < 3) {
        const e = new Error("Invalid");
        e.response = {
          status: 400,
          data: { message: "Mật khẩu mới quá ngắn" },
        };
        throw e;
      }
      u.password = String(data.newPassword);
      return { data: { ok: true } };
    }

    // ===== USERS: Create Teacher (ADMIN) (NEW)
    if (url === "/users/teachers") {
      await delay(300);
      const {
        username,
        fullName,
        email = "",
        phone = "",
        tempPassword,
        profile,
      } = data || {};
      if (!username || !fullName || !tempPassword) {
        const e = new Error("Validation");
        e.response = {
          status: 400,
          data: { message: "Thiếu username/fullName/tempPassword" },
        };
        throw e;
      }
      if (USERS.some((x) => x.username === username)) {
        const e = new Error("Validation");
        e.response = {
          status: 400,
          data: { message: "Username đã tồn tại" },
        };
        throw e;
      }
      const user = {
        id: nextUserId++,
        username,
        fullName,
        email,
        phone,
        roles: ["ROLE_TEACHER"],
        enabled: true,
        password: String(tempPassword),
      };
      USERS.push(user);
      if (profile) {
        TEACHER_PROFILES[user.id] = {
          id: nextTeacherProfileId++,
          userId: user.id,
          bio: profile.bio || "",
          subjects: profile.subjects || "",
          yearsExperience: Number(profile.yearsExperience || 0),
          avatarUrl: profile.avatarUrl || "",
        };
      }
      return { data: user };
    }

    // ===== CLASSROOM CREATE (mock) (giữ logic cũ)
    if (url === "/classrooms") {
      await delay(300);
      const name = (data?.name || "").trim();
      const capacity = Number(data?.capacity);

      if (!name) {
        const error = new Error("VALIDATION");
        error.response = {
          status: 400,
          data: { message: "Tên classroom không được để trống" },
        };
        throw error;
      }
      if (!Number.isInteger(capacity) || capacity <= 0) {
        const error = new Error("VALIDATION");
        error.response = {
          status: 400,
          data: { message: "Sức chứa phải là số nguyên dương" },
        };
        throw error;
      }

      const item = {
        id: nextClassroomId++,
        name,
        capacity,
        active: true,
        status: "ACTIVE",
      };
      CLASSROOMS.push(item);
      return { data: item };
    }

    // Mặc định: gọi thật
    return realPost(url, data, cfg);
  };

  // -------------
  // GET (me + users + teachers + classrooms)
  // -------------
  http.get = async (url, cfg = {}) => {
    // AUTH /me (mock)
    if (url === "/auth/me") {
      await delay(200);
      const str = localStorage.getItem("auth_profile");
      if (!str) {
        const error = new Error("Unauthenticated");
        error.response = { status: 401, data: { message: "Unauthenticated" } };
        throw error;
      }
      return { data: JSON.parse(str) };
    }

    // ===== USERS LIST + SEARCH (Admin) (NEW)
    if (url === "/users") {
      await delay(300);
      const q = (cfg?.params?.q || "").toString().toLowerCase();
      const page = Number(cfg?.params?.page ?? 0);
      const size = Number(cfg?.params?.size ?? 20);
      let items = USERS;
      if (q) {
        items = items.filter(
          (u) =>
            (u.email || "").toLowerCase().includes(q) ||
            (u.phone || "").toLowerCase().includes(q)
        );
      }
      const start = page * size;
      const content = items.slice(start, start + size);
      return {
        data: {
          content,
          number: page,
          size,
          totalElements: items.length,
          totalPages: Math.max(1, Math.ceil(items.length / size)),
        },
      };
    }

    // ===== TEACHERS LIST (Admin) (NEW)
    if (url === "/users/teachers") {
      await delay(250);
      const page = Number(cfg?.params?.page ?? 0);
      const size = Number(cfg?.params?.size ?? 20);
      const items = USERS.filter((u) => u.roles.includes("ROLE_TEACHER"));
      const start = page * size;
      const content = items.slice(start, start + size);
      return {
        data: {
          content,
          number: page,
          size,
          totalElements: items.length,
          totalPages: Math.max(1, Math.ceil(items.length / size)),
        },
      };
    }

    // ===== VIEW USER PROFILE (Admin) (NEW)
    if (/^\/users\/\d+$/.test(url)) {
      await delay(200);
      const id = Number(url.match(/\/users\/(\d+)$/)[1]);
      const u = USERS.find((x) => x.id === id);
      if (!u) {
        const e = new Error("Not Found");
        e.response = { status: 404, data: { message: "User not found" } };
        throw e;
      }
      return { data: { ...u } };
    }

    // ===== VIEW TEACHER PROFILE (Admin/Teacher) (NEW)
    if (/^\/users\/\d+\/teacher-profile$/.test(url)) {
      await delay(200);
      const userId = Number(url.match(/\/users\/(\d+)\/teacher-profile$/)[1]);
      const p = TEACHER_PROFILES[userId];
      if (!p) {
        const e = new Error("Not Found");
        e.response = {
          status: 404,
          data: { message: "Teacher profile not found" },
        };
        throw e;
      }
      return { data: { ...p } };
    }

    // ===== CLASSROOMS LIST (mock) — hỗ trợ ?q=, ?page=, ?size= (giữ cũ)
    if (url === "/classrooms") {
      await delay(350);
      const q = (cfg?.params?.q || "").toString().toLowerCase();
      const page = Number(cfg?.params?.page ?? 0);
      const size = Number(cfg?.params?.size ?? 10);

      let items = CLASSROOMS;
      if (q) items = items.filter((x) => x.name.toLowerCase().includes(q));

      const start = page * size;
      const paged = items.slice(start, start + size);
      return {
        data: {
          content: paged,
          number: page,
          size,
          totalElements: items.length,
          totalPages: Math.ceil(items.length / size),
        },
      };
    }

    // ===== CLASSROOM DETAIL (mock) (giữ cũ)
    if (url.startsWith("/classrooms/")) {
      await delay(250);
      const idRaw = getClassroomIdFromUrl(url);
      const id = isNaN(Number(idRaw)) ? idRaw : Number(idRaw);
      const found = CLASSROOMS.find((x) => String(x.id) === String(id));
      if (!found) {
        const error = new Error("Not Found");
        error.response = {
          status: 404,
          data: { message: "Không tìm thấy classroom" },
        };
        throw error;
      }
      return { data: found };
    }

    // Mặc định: gọi thật
    return realGet(url, cfg);
  };

  // -------------
  // PUT (users + teacher-profile + classrooms)
  // -------------
  http.put = async (url, data, cfg) => {
    // ===== USERS: Update User Profile (Admin/self) (NEW)
    if (/^\/users\/\d+$/.test(url)) {
      await delay(250);
      const id = Number(url.match(/\/users\/(\d+)$/)[1]);
      const idx = USERS.findIndex((u) => u.id === id);
      if (idx === -1) {
        const e = new Error("Not Found");
        e.response = { status: 404, data: { message: "User not found" } };
        throw e;
      }
      USERS[idx] = {
        ...USERS[idx],
        fullName: data?.fullName ?? USERS[idx].fullName,
        email: data?.email ?? USERS[idx].email,
        phone: data?.phone ?? USERS[idx].phone,
      };
      return { data: { ...USERS[idx] } };
    }

    // ===== TEACHER PROFILE: Update (Teacher) (NEW)
    if (/^\/users\/\d+\/teacher-profile$/.test(url)) {
      await delay(250);
      const userId = Number(url.match(/\/users\/(\d+)\/teacher-profile$/)[1]);
      if (!TEACHER_PROFILES[userId]) {
        TEACHER_PROFILES[userId] = {
          id: nextTeacherProfileId++,
          userId,
          bio: "",
          subjects: "",
          yearsExperience: 0,
          avatarUrl: "",
        };
      }
      TEACHER_PROFILES[userId] = { ...TEACHER_PROFILES[userId], ...data };
      return { data: { ...TEACHER_PROFILES[userId] } };
    }

    // ===== CLASSROOMS UPDATE (mock) (giữ cũ + active/status)
    if (url.startsWith("/classrooms/")) {
      await delay(300);
      const idRaw = getClassroomIdFromUrl(url);
      const id = isNaN(Number(idRaw)) ? idRaw : Number(idRaw);
      const idx = CLASSROOMS.findIndex((x) => String(x.id) === String(id));
      if (idx === -1) {
        const error = new Error("Not Found");
        error.response = {
          status: 404,
          data: { message: "Không tìm thấy classroom" },
        };
        throw error;
      }

      const name = (data?.name || "").trim();
      const capacity = Number(data?.capacity);

      if (!name) {
        const error = new Error("VALIDATION");
        error.response = {
          status: 400,
          data: { message: "Tên classroom không được để trống" },
        };
        throw error;
      }
      if (!Number.isInteger(capacity) || capacity <= 0) {
        const error = new Error("VALIDATION");
        error.response = {
          status: 400,
          data: { message: "Sức chứa phải là số nguyên dương" },
        };
        throw error;
      }

      // Giữ hoặc cập nhật trạng thái
      const active = data?.active ?? CLASSROOMS[idx].active;
      const status = data?.status ?? (active ? "ACTIVE" : "INACTIVE");

      CLASSROOMS[idx] = { ...CLASSROOMS[idx], name, capacity, active, status };
      return { data: CLASSROOMS[idx] };
    }

    return realPut(url, data, cfg);
  };

  // -------------
  // PATCH (users enable/disable + classrooms enable/disable)
  // -------------
  http.patch = async (url, data, cfg) => {
    // ===== USERS: Deactivate / Reactivate (Admin) (NEW)
    if (/^\/users\/\d+\/enabled$/.test(url)) {
      await delay(180);
      const id = Number(url.match(/\/users\/(\d+)\/enabled$/)[1]);
      const u = USERS.find((x) => x.id === id);
      if (!u) {
        const e = new Error("Not Found");
        e.response = { status: 404, data: { message: "User not found" } };
        throw e;
      }
      u.enabled = !!data?.enabled;
      return { data: { ...u } };
    }

    // ===== CLASSROOMS: enable/disable (giữ logic cũ)
    if (url.endsWith("/enable") || url.endsWith("/disable")) {
      await delay(200);
      const idRaw = url.match(/\/classrooms\/(.+)\/(enable|disable)$/)?.[1];
      const id = isNaN(Number(idRaw)) ? idRaw : Number(idRaw);
      const idx = CLASSROOMS.findIndex((x) => String(x.id) === String(id));
      if (idx === -1) {
        const error = new Error("Not Found");
        error.response = {
          status: 404,
          data: { message: "Không tìm thấy classroom" },
        };
        throw error;
      }
      const makeActive = url.endsWith("/enable");
      CLASSROOMS[idx] = {
        ...CLASSROOMS[idx],
        active: makeActive,
        status: makeActive ? "ACTIVE" : "INACTIVE",
      };
      return { data: CLASSROOMS[idx] };
    }

    // Mặc định: nếu có PATCH khác thì pass-through
    return realPatch(url, data, cfg);
  };

  // -------------
  // DELETE (classrooms) — giữ cũ
  // -------------
  http.delete = async (url, cfg) => {
    if (url.startsWith("/classrooms/")) {
      await delay(250);
      const idRaw = getClassroomIdFromUrl(url);
      const id = isNaN(Number(idRaw)) ? idRaw : Number(idRaw);
      const idx = CLASSROOMS.findIndex((x) => String(x.id) === String(id));
      if (idx === -1) {
        const error = new Error("Not Found");
        error.response = {
          status: 404,
          data: { message: "Không tìm thấy classroom" },
        };
        throw error;
      }
      CLASSROOMS.splice(idx, 1);
      return { data: { ok: true } }; // 204 cũng được
    }

    return realDelete(url, cfg);
  };
}
