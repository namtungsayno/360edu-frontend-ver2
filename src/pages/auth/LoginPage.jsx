import React, { useState } from "react";
import AuthLayout from "layout/auth/AuthLayout";
import useLogin from "hooks/auth/useLogin";
import { useAuth } from "context/auth/AuthContext";

export default function LoginPage() {
  const { login, loading, error } = useLogin();
  const { isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login({ email, password });
      // Ví dụ: điều hướng sau login
      // window.location.href = "/courses";
    } catch {}
  }

  return (
    <section className="login_register section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="login">
              <h4 className="login_register_title">Đăng nhập</h4>

              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    className="form-control"
                    placeholder="Nhập email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Mật khẩu</label>
                  <input
                    id="login-password"
                    type="password"
                    className="form-control"
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span className="form-check-label">Ghi nhớ đăng nhập</span>
                  </label>
                  <a href="/auth/forgot" className="text-primary">
                    Quên mật khẩu?
                  </a>
                </div>

                <button
                  className="bg_btn bt w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập…" : "Đăng nhập"}
                </button>

                {error && <div className="mt-3 text-danger">{error}</div>}
                <p className="mt-2" style={{ opacity: 0.7 }}>
                  Demo: admin@demo.com / 123
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
