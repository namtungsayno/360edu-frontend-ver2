import { useState, useCallback } from "react";
import { authService } from "services/auth/authService";

export default function useLogin() {
  const [state, set] = useState({ loading: false, error: null, data: null });

  const login = useCallback(async ({ username, password }) => {
    set({ loading: true, error: null, data: null });
    try {
      const res = await authService.login({ username, password });
      set({ loading: false, error: null, data: res });
      return res;
    } catch (e) {
      // 🧠 Ghi log chi tiết để debug (xem trong F12 -> Console)
      console.error(
        "❌ Login error:",
        e?.response?.status,
        e?.response?.data || e.message
      );

      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Đăng nhập thất bại";

      set({ loading: false, error: msg, data: null });
      throw e;
    }
  }, []);

  return {
    login,
    loading: state.loading,
    error: state.error,
    data: state.data,
  };
}
