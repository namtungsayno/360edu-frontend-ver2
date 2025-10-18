// src/services/auth/authService.js
import { http } from "api/http";

const PROFILE_KEY = "auth_profile";

const saveProfile = (p) =>
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p || null));
const loadProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const authService = {
  /** Đăng ký tài khoản mới: email + username + password */
  async register({ email, username, password }) {
    const payload = {
      email: email?.trim(),
      username: username?.trim(),
      password,
    };
    const { data } = await http.post("/auth/register", payload);
    // Không lưu profile ở đây vì chưa đăng nhập
    return data; // tuỳ BE trả gì: message/id/...
  },

  /** Đăng nhập: BE set cookie, body trả UserInfoResponse */
  async login({ username, password }) {
    const { data } = await http.post("/auth/login", { username, password });
    saveProfile(data);
    return { user: data };
  },

  /** Lấy hồ sơ: ưu tiên theo cookie; nếu 401 thì trả cache (nếu có) */
  async getProfile() {
    try {
      const { data } = await http.get("/auth/me");
      saveProfile(data);
      return data;
    } catch {
      return loadProfile();
    }
  },

  /** Đăng xuất: gọi BE xóa cookie + dọn local cache */
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
