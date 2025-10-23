// src/services/auth/authService.js
import { http } from "api/http";

/** Chuẩn hoá role:
 * - Cho phép truyền "user" | "teacher" | "admin" hoặc mảng các string
 * - Mặc định: ["user"]
 */
function normalizeRole(role) {
  if (!role) return ["user"];
  if (Array.isArray(role)) return role.length ? role : ["user"];
  return [String(role)]; // string -> array
}

/** ===== Core calls ===== */
async function doSignup({ username, email, password, role }) {
  const payload = {
    username: username?.trim(),
    email: email?.trim(),
    password,
    role: normalizeRole(role),
  };
  const { data } = await http.post("/auth/signup", payload);
  return data; // BE trả message/id...
}

async function doLogin({ username, password }) {
  const { data } = await http.post("/auth/login", { username, password });
  saveProfile(data); // BE trả UserInfoResponse
  return { user: data };
}

/** ===== Local cache hồ sơ ===== */
const PROFILE_KEY = "auth_profile";

function saveProfile(p) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p || null));
}
function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** ===== Public API ===== */
export const authService = {
  /** Đăng ký tài khoản mới
   *  - Cho phép gọi theo 2 tên: signup() hoặc register()
   *  - role: "user" | "teacher" | "admin" | string[] (mặc định "user")
   */
  signup: doSignup,
  register: doSignup,

  /** Đăng nhập: BE set cookie, body trả UserInfoResponse */
  login: doLogin,

  /** Lấy hồ sơ dựa theo cookie; nếu 401 thì trả cache (nếu có) */
  async getProfile() {
    try {
      const { data } = await http.get("/auth/me");
      saveProfile(data);
      return data;
    } catch {
      return loadProfile();
    }
  },

  /** Đăng xuất: gọi BE xoá cookie + dọn local cache */
  async logout() {
    try {
      await http.post("/auth/logout");
    } catch (err) {
      console.warn("Logout error:", err?.message);
    }
    saveProfile(null);
    return true;
  },

  /** Khôi phục phiên: đọc cache; nếu không có thì hỏi BE dựa cookie */
  async restoreSession() {
    const cached = loadProfile();
    if (cached) return { user: cached };
    try {
      const u = await this.getProfile();
      return { user: u || null };
    } catch {
      await this.logout();
      return { user: null };
    }
  },
};
