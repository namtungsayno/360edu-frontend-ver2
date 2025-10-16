import { authApi } from "api/auth/authApi";

const ACCESS = "access_token";
const REFRESH = "refresh_token";
const PROFILE = "auth_profile";

const saveTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem(ACCESS, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH, refreshToken);
};
const clearTokens = () => { localStorage.removeItem(ACCESS); localStorage.removeItem(REFRESH); };
const saveProfile = (p) => localStorage.setItem(PROFILE, JSON.stringify(p || null));
const loadProfile = () => { try { return JSON.parse(localStorage.getItem(PROFILE)); } catch { return null; } };

export const authService = {
  async login({ email, password }) {
    const { data } = await authApi.login({ email, password });
    const accessToken = data?.accessToken || data?.token || "";
    const refreshToken = data?.refreshToken || "";
    saveTokens({ accessToken, refreshToken });
    const me = await authApi.getProfile().then(r => r.data);
    saveProfile(me);
    return { user: me, accessToken, refreshToken };
  },
  async getProfile() {
    const { data } = await authApi.getProfile();
    saveProfile(data);
    return data;
  },
  async logout() {
    try { await authApi.logout(); } catch {}
    clearTokens(); saveProfile(null); return true;
  },
  async restoreSession() {
    const at = localStorage.getItem(ACCESS);
    const cached = loadProfile();
    if (!at && !cached) return { user: null };
    try { const u = await this.getProfile(); return { user: u }; }
    catch { await this.logout(); return { user: null }; }
  },
};
