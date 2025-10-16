import React, { useState } from "react";
import AuthLayout from "layout/auth/AuthLayout";
import useLogin from "hooks/auth/useLogin";
import { useAuth } from "context/auth/AuthContext";

export default function LoginPage() {
  const { login, loading, error } = useLogin();
  const { isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login({ email, password });
      // Ví dụ: điều hướng sau login
      // window.location.href = "/courses";
    } catch {}
  }

  return (
    <AuthLayout title="Đăng nhập">
      {isAuthenticated && <p>Đã đăng nhập: {user?.fullName || user?.email}</p>}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          placeholder="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
        <p style={{ opacity: 0.7, marginTop: 8 }}>
          Demo: admin@demo.com / 123 (mock bật sẵn)
        </p>
        <p style={{ opacity: 0.6 }}>
          Mock: {String(process.env.REACT_APP_USE_MOCK === "true")}
        </p>
      </form>
    </AuthLayout>
  );
}
