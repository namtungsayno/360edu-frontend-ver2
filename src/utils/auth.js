// src/utils/auth.js
export function logoutSoft() {
  // Dọn localStorage và chuyển hướng
  localStorage.removeItem("auth_profile");
  if (!window.location.pathname.startsWith("/auth")) {
    window.location.href = "/auth/login";
  }
}
