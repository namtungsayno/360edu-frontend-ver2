import { useState } from "react";
import { register as registerApi } from "services/auth/authService";

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function register(payload) {
    setError("");
    setLoading(true);
    try {
      const res = await registerApi(payload);
      return res?.data;
    } catch (err) {
      // ưu tiên message từ BE nếu có
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Đăng ký thất bại";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }

  return { register, loading, error, setError };
}
