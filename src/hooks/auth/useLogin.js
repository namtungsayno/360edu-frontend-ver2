import { useState, useCallback } from "react";
import { authService } from "services/auth/authService";

export default function useLogin() {
  const [state, set] = useState({ loading: false, error: null, data: null });

  const login = useCallback(async ({ email, password }) => {
    set({ loading: true, error: null, data: null });
    try {
      const res = await authService.login({ email, password });
      set({ loading: false, error: null, data: res });
      return res;
    } catch (e) {
      const msg = e?.response?.data?.message || "Đăng nhập thất bại";
      set({ loading: false, error: msg, data: null });
      throw e;
    }
  }, []);

  return { login, loading: state.loading, error: state.error, data: state.data };
}
