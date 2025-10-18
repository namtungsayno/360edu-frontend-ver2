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
  const realDelete =
    http.delete?.bind(http) ||
    (() => Promise.reject(new Error("DELETE not bound")));

  // =========================
  // In-memory DB cho Classroom
  // =========================
  let CLASSROOMS = [
    { id: 1, name: "Lớp 10A1", capacity: 30 },
    { id: 2, name: "Lớp 11A2", capacity: 35 },
    { id: 3, name: "Physics Lab", capacity: 25 },
  ];
  let nextId = 4;

  // Helper lấy id từ URL: "/classrooms/123" -> "123"
  const getIdFromUrl = (url) => {
    const m = url.match(/\/classrooms\/(.+)$/);
    return m ? m[1] : null;
  };

  // -------------------
  // POST (login/logout + classroom create)
  // -------------------
  http.post = async (url, data, cfg) => {
    // AUTH LOGIN (mock)
    if (url === "/auth/login") {
      await delay(400);
      if (data?.username === "admin" && data?.password === "123") {
        return {
          data: {
            id: 1,
            username: "admin",
            email: "admin@demo.com",
            roles: ["ROLE_ADMIN"],
          },
        };
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
      return { data: { ok: true } };
    }

    // CLASSROOM CREATE (mock)
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

      const item = { id: nextId++, name, capacity };
      CLASSROOMS.push(item);
      return { data: item };
    }

    // Mặc định: gọi thật
    return realPost(url, data, cfg);
  };

  // -------------
  // GET (me + classrooms list/detail)
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

    // CLASSROOMS LIST (mock) — hỗ trợ ?q=, ?page=, ?size=
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

    // CLASSROOM DETAIL (mock)
    if (url.startsWith("/classrooms/")) {
      await delay(250);
      const idRaw = getIdFromUrl(url);
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
  // PUT (classrooms update) (mock)
  // -------------
  http.put = async (url, data, cfg) => {
    if (url.startsWith("/classrooms/")) {
      await delay(300);
      const idRaw = getIdFromUrl(url);
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

      CLASSROOMS[idx] = { ...CLASSROOMS[idx], name, capacity };
      return { data: CLASSROOMS[idx] };
    }

    return realPut(url, data, cfg);
  };

  // -------------
  // DELETE (classrooms remove) (mock)
  // -------------
  http.delete = async (url, cfg) => {
    if (url.startsWith("/classrooms/")) {
      await delay(250);
      const idRaw = getIdFromUrl(url);
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
      return { data: { ok: true } }; // hoặc: { status: 204, data: null }
    }

    return realDelete(url, cfg);
  };
}
