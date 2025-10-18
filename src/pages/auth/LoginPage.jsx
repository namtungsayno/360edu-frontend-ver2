import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "context/auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // nếu vừa đăng ký xong
  const justRegistered = location.state?.justRegistered;

  // giữ nguyên state theo form cũ nhưng dùng username thay vì email
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(!!justRegistered);

  useEffect(() => {
    if (justRegistered) {
      // tự ẩn thông báo sau 4 giây
      const t = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(t);
    }
  }, [justRegistered]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login({ username, password }); // gọi BE, set cookie + cache user
      navigate("/home", { replace: true }); // điều hướng về homepage
    } catch (ex) {
      setErr(ex.displayMessage || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login_register section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="login">
              <h4 className="login_register_title">Đăng nhập</h4>

              {/* 🔔 Thông báo đăng ký thành công */}
              {showSuccess && (
                <div
                  className="d-flex align-items-center gap-2 p-3 mb-3 rounded-3"
                  style={{
                    backgroundColor: "#e6f4ea",
                    border: "1px solid #b7e1c2",
                    color: "#1a7f37",
                    fontWeight: 500,
                  }}
                >
                  <i className="bx bx-check-circle fs-4"></i>
                  <span>Tạo tài khoản thành công! Vui lòng đăng nhập.</span>
                </div>
              )}

              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="login-username">Username</label>
                  <input
                    id="login-username"
                    type="text"
                    className="form-control"
                    placeholder="Nhập username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                  <Link to="/auth/forgot" className="text-primary">
                    Quên mật khẩu?
                  </Link>
                </div>

                <button
                  className="bg_btn bt w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập…" : "Đăng nhập"}
                </button>

                {err && (
                  <div
                    className="d-flex align-items-center gap-2 p-3 mt-3 rounded-3"
                    style={{
                      backgroundColor: "#fdecea",
                      border: "1px solid #f5c2c7",
                      color: "#b02a37",
                    }}
                  >
                    <i className="bx bx-error-circle fs-5"></i>
                    <span>{err}</span>
                  </div>
                )}

                <div className="text-center mt-3">
                  Chưa có tài khoản?{" "}
                  <Link to="/auth/register" className="text-primary">
                    Đăng ký ngay
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
